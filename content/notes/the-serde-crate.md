---
title: The Serde Crate
date: 2024-03-25
tags:
  - cs
  - rust
---

Serde is a framework for serializing and deserializing Rust data structures between various formats.

## The Serde Data Model
Serde's API consists of three parts: the data format, the data type, and the Serde data model.

The data type is the implementation of a data structure in Rust (`Serialize`, `Deserialize`). The data format is whatever isn't the Rust data structure, it could be JSON, BSON, CSV, etc. (`Serializer`, `Deserializer`). The Serde data model exists between the two and maps Rust data structures to specified data types.

### Serde Types
The Serde data model is a simplified version of Rust's type system. The goal for `Serialize` is to take the data in a Rust data structure and convert it to a structure consisting of Serde types. From there, `Serializer`'s goal is to take the translated Serde types and once again transform them into the bytes of the serialized protocol. The goal for `Deserialize` and `Deserializer` is the reciprocal of that.

## The Serialize and Deserialize Traits

```rust
pub trait Serialize {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S : Serializer;
}
```

The job of `serialize` is to turn `self` into the data model of Serde. This is done by calling the appropriate methods on the generic `<S>` impl Serializer depending on what protocol you're targeting.

The `Serializer` trait has many methods (`serialize_u32`, `serialize_unit_struct`, etc.) that provide this functionality.

### Serializing Structs
Serializing structs is not as simple as just calling `serialize_u32` since the struct itself is more of a wireframe for the primitives (or substructs) within it than a simple value. The `Serializer` has a `serialize_struct` method which requires the `name` of the struct and `len`, the amount of fields within it.

```rust
fn serialize_struct(
    self,
    name: &'static str,
    len: usize
) -> Result<Self::SerializeStruct, Self::Error>
```

Notice how `serialize_struct` returns a `SerializeStruct`. It's a subserializer for the struct. `SerializeStruct` is an assosiated type on `Serializer`, which contains three functions: `serialize_field<T>`, `end`, and `skip_field`.

```rust
pub trait SerializeStruct {
    type Ok;
    type Error: Error;

    fn serialize_field<T>(
        &mut self,
        key: &'static str,
        value: &T,
    ) -> Result<(), Self::Error>
    where
	T: Serialize + ?Sized;
    
    fn end(self) -> Result<Self::Ok, Self::Error>;

    fn skip_field(&mut self, key: &'static str) -> Result<(), Self::Error> { .. }
}
```

### Deserializing Structs
One observable difference between a derivation of `Deserialize` on a struct as opposed to `Serialize` is the presence of a `<'de>` generic lifetime parameter:

```rust
//codegen...
impl<'de> _serde::Deserialize<'de> for Foo {
//codegen...
```

Imaging calling deserialize on `foo.file_data`, a thousand-line `String`. For efficiency, we want to be able to return a reference to this string (`&str`) instead of having to copy it. This requires knowledge of the lifetime of the string reference. Note that this may not be possible if there were escape characters in the file.

The implementation of `Deserialize` is built around `Visitor`. The Visitor walks through the `Deserializer`. `Deserialize` tells the `Deserializer` what value is being expected next (this is determined based on the types within your Rust struct). The `Deserializer` consumes `self` and uses a `Visitor` to explore the expected type. In the deserialization of a struct, Visitor will call methods back in the `Deserializer` to to deserialize the attributes.

Consider codegen for the `foo` struct:

```rust
enum __Field { .. }
struct __FieldVisitor;
impl <'de> _serde::de::Visitor<'de> for __FieldVisitor { .. }
```

The deserializationg of a struct involves the deserialization of both keys/fields and values. The further `impl<'de> _serde::Deserialize<'de> for __Field` uses `__FieldVisitor` to visit and interpret struct fields in `deserialize_identifier`.