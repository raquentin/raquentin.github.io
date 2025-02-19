---
title: "Answering \"what's your favorite C++ feature\""
date: 02-16-2025
tags:
  - cpp
---

> "What's your favorite C++20 feature?"

is one of my favorite interview questions, generic to the version one says they use. It gauges how often someone programs C++ on their computer (not just on Leetcode), and how well they understand the ecosystem they program in. I think there's something to be said for a programmer that upgraded to C++20 specifically to use [[#modules|Modules]] to optimize away impossible code branches, especially compared to a programmer who uses whatever C++ version `brew install` fetched at the time.

In many examples below, I'll be using snippets from [[https://github.com/raquentin/raquest|Raquest]], a domain-specific language to [[on-garbage-closed-source-http-clients|replace Postman and Insomnia]].

Use [[https://en.cppreference.com/w/cpp|cppreference]] to create a list of **your** favorite C++ features. Here are a few of mine for inspiration:

## C++11

Think of any modern C++ feature--chances are it's from C++11. Below are five that I can't imagine writing C++ without. Consider additional reading on rvalue references, smart pointers, `decltype`, `final`, `= delete`, and ~20 more things I didn't list here.

### Move semantics 

Move semantics are the contract allowing one object to "steal" resources from another. Instead of copying large resources like heap allocations between object instances, you can move them, copying the pointer into the new object and hence ownership of the underlying heap object. Consider this elementary `std::vector` implementation:

```cpp
class MyVector {
  public:
    size_t size_;
    int* data_;
    // ... constructor, copy constructor ...
    MyVector(MyVector&& other) noexcept
        : size_(other.size_), data_(other.data_) {
        // you must leave [`other`] in a valid state
        other.size_ = 0;
        other.data_ = nullptr;
    }
    // ... copy/move assignment operators, destructor ...
};
```

Move semantics in C++ standardize the common idea of transferring ownership (or better, the responsibility to manage) of resources. Move constructors and assignment operators encapsulate the steal-then-nullify logic in one place.

Without move semantics, you'd do it the same as you would in C:

```c
MyBuffer* move_buffer(MyBuffer* src) {
    MyBuffer* dest = malloc(sizeof(MyBuffer)); 
    dest->data = src->data;
    dest->size = src->size;
    src->data = NULL;
    src->size = 0;
    return dest; 
}
```

Along with the rule of five, move semantics provide a universal protocol for moving resources that C++ compilers and develoeprs understand.

### Lambda expressions

Lambda expressions create closures. Below is a use of a lambda to construct a function in-place for use in a thread pool.
```cpp
ThreadPool pool(config().jobs);
for (const auto &filename : input_filenames.value()) {
    futures.emplace_back(
        pool.submit([filename] { return Raquest(filename).run(); }));
}
```

The lambda here is `[filename] { return Raquest(filename).run(); }`. It's an anonymous function capturing the filename from the for each loop and constructing an object with it.

### `nullptr`

Consider this code:
```cpp
void f(char *ptr);
void f(int num);
f(NULL);
```

What does `f(NULL)` refer to? With `#define NULL 0`, `f(int num)` will be called, despite the likely intention. Calling `f(nullptr)` would remove this ambiguity.

An explicit `nullptr_t` type removes ambiguity with types. With `#define NULL 0` effectively making `NULL` an `int`, how do you resolve overloaded functions?

### `auto`

As a fan of [[https://herbsutter.com/2013/08/12/gotw-94-solution-aaa-style-almost-always-auto/|Almost Always Auto]] C++, `auto` is one of to most common keywords in my codebases. It allows the compiler to deduce the type of an lvalue based on its initializer.

It's elementary use case is just to infer the types of literals:

```cpp
auto x = 42; // int
auto pi = 3.14159; // double
```

But you can also use it to infer the type of generic lambdas, for example.
```cpp
auto custom_hello_world(const std::string& greeting) {
    // the returned lambda is generic: it accepts any type that can be converted to a string.
    return [greeting](auto&& name) -> std::string {
        return greeting + ", " + std::forward<decltype(name)>(name) + "!";
    };
}
```

Lastly, I often use it as a shorthand reference for super long types. Hopefully you aren't `using namespace std`.

```cpp
std::vector<std::future<
  std::expected<CurlResponse, std::vector<std::unique_ptr<Error>>>>>
  futures;
...
for (auto &fut : futures)
```

### `constexpr`

`constexpr` gets crazy pretty quickly, but in essence, it denotes computations to be performed at compile-time.

Consider this program printing `square(5)` to `std::cout`:

```cpp
constexpr int square(int x) {
    return x * x;
}

int main() {
    constexpr int val = square(5);
    std::cout << val << "\n";
    return 0;
}
```

The compiler computed $5*5$ itself and embedded `25` as an immediate value, with no call to `square`:
```asm
main:
        push    rbp
        mov     rbp, rsp
        sub     rsp, 16
        mov     DWORD PTR [rbp-4], 25
        mov     esi, 25
        mov     edi, OFFSET FLAT:std::cout
        call    std::ostream::operator<<(int)
        mov     eax, 0
        leave
        ret
```

Now what if we remove comptime?
```cpp
int square(int x) {
    return x * x;
}

int main() {
    int val = square(5);
    std::cout << val << "\n";
    return 0;
}
```

The binary now calls `square` at runtime:
```asm
square(int):
        push    rbp
        mov     rbp, rsp
        mov     DWORD PTR [rbp-4], edi
        mov     eax, DWORD PTR [rbp-4]
        imul    eax, eax
        pop     rbp
        ret
main:
        push    rbp
        mov     rbp, rsp
        sub     rsp, 16
        mov     edi, 5
        call    square(int)
        mov     DWORD PTR [rbp-4], eax
        mov     eax, DWORD PTR [rbp-4]
        mov     esi, eax
        mov     edi, OFFSET FLAT:std::cout
        call    std::ostream::operator<<(int)
        mov     eax, 0
        leave
        ret
```

## C++14

C++14 is described as "a minor version after the major version C++11, featuring mainly minor improvements and defect fixes". C++14 isn't the best standard for this interview question, but there's still a few features to note:

### `decltype(auto)`

> `decltype` is useful when declaring types that are difficult or impossible to declare using standard notation, like lambda-related types or types that depend on template parameters. \
> -- [[https://en.cppreference.com/w/cpp/language/decltype|cppreference]]

`decltype(auto)` expands on upon that, particularly for ergonomics when implementing functions not only generic to a `T`, but also to whether that `T` is a reference or not.

Consider:
```cpp
struct MyClass {
    int value;
    MyClass(int v) : value(v) {}
    
    // overriding copy constructor to print when copied
    MyClass(const MyClass& other) : value(other.value) {
        std::cout << "Copied\n";
    }
};

// auto: the returned type is MyClass (copy).
auto get_object_copy(std::vector<MyClass>& vec, size_t i) {
    return vec[i];
}

// decltype(auto): preserves the reference type.
decltype(auto) get_object_ref(std::vector<MyClass>& vec, size_t i) {
    return vec[i];
}

int main() {
    // construct objs
    std::vector<MyClass> objects;
    objects.emplace_back(100);

    // use auto fn, observe side effects
    std::cout << "Using `auto` fn: ";
    auto copy_obj = get_object_copy(objects, 0);
    copy_obj.value = 200;
    std::cout << "Original object value: " << objects[0].value << std::endl;

    // use decltype(auto) fn, observe side effects
    std::cout << "Using `decltype(auto)` fn: ";
    decltype(auto) ref_obj = get_object_ref(objects, 0);
    std::cout << "\n";
    ref_obj.value = 300;
    std::cout << "Original object value: " << objects[0].value << std::endl;

    return 0;
}
```

The output is:
```
Using `auto` fn: Copied
Original object value: 100
Using `decltype(auto)` fn:
Original object value: 300
```

In the output, we see that the `auto` function called the copy constructor, while `decltype(auto)` preserved the reference it was passed (`& vec`).

### `[[deprecated]]`

It's an annotation for library devs to signal users to migrate to new APIs:
```cpp
[[deprecated("Use new_implementation instead.")]]
void bad_implementation() {...}

void new_implementation() {...}
```

## C++17

We're back to the path of major releases with C++17.

### `std::variant`

`std::variant` is a type-safe union. You can use `std::get_if`, `std::get`, and `std::visit` to access the underlying `T`.

I find `std::visit` combined with `comptime` to be quite powerful:
```cpp
constexpr inline std::string ParserError::get_brief() const {
  return std::visit(
    [](auto &&arg) {
      using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, MalformedSectionHeader>)
          return "malformed section header";
        else if constexpr (std::is_same_v<T, ExpectedColonInHeaderAssignment>)
          return "missing colon in header assignment";
       },
    info_);
}
```

See also: [[#constexpr-virtual-functions|constexpr virtual functions]] from C++20.

### `std::optional`

`std::optional` is quite nice for handling nullish yet non-error states. Consider this function for finding a certain header if it exists in an HTTP response:
```cpp
std::optional<std::string>
CurlResponse::get_header_value(const std::string &key) const {
    auto it = headers.find(key);
    if (it != headers.end()) {
        return it->second;
    }
    return std::nullopt;
}
```

With `std::optional`, the "not found" state is encoded in `std::nullopt`. Other ways to do this might involve `new`, passing a `std::string&` as a parameter, or worries about ownership. There exist good reasons to use each of these tactics, but I find `std::optional` fits my style best.

### `std::reduce`

`std::reduce` is a declarative and parallelizable way to fold collections.

Compare this imperative way to sum a collection:
```cpp
int sum_for_loop = 0;
for (int n : numbers) {
  sum_for_loop += n;
}
```
To this one using `std::reduce`:
```cpp
int sum_par = std::reduce(std::execution::seq, numbers.begin(), numbers.end(), 0);
```

Swap `seq` for `par` for free (and libre) potential parallelism.

## C++20

Another major release.

### Semaphores

Via platform-specific APIs like POSIX's `pthread.h`, you could of course use semaphores before C++20, and even before C++98. But now, it's a bit cleaner and more maintainable for platform-agnostic use cases.

```cpp
// C++20
#include <semaphore>
std::counting_semaphore<2> sem(2);

// before
#include <pthread.h>
sem_t sem;
sem_init(&sem, 0, 2);
```

### `[[unlikely]]`

> [The `[[likely]]` and `[[unlikely]]` directives] allow the compiler to optimize for the case where paths of execution including that statement are more or less likely than any alternative path of execution that does not include such a statement. \
> -- [[https://en.cppreference.com/w/cpp/language/attributes/likely|cppreference]]

Note that there are many reasons to [[https://blog.aaronballman.com/2020/08/dont-use-the-likely-or-unlikely-attributes/|avoid these attributes]]. That's why it's **my** C++ features list. Write C++, read the reference, and make your own opinions.

### Modules

C++20 modules can:
- better organize code
- avoid ODR violations
- improve compile times
- deduplicate content between headers and source files
- be annoying to use with CMake

In Raquest, I have a custom thread pool defined in `thread_pool.cppm` that encapsulates threading logic.

Here's what it looks like:
```cpp
module;
// #include ...
export module ThreadPool;
export class ThreadPool {
  public:
    explicit ThreadPool(size_t threads);

    /**
     * @brief Schedule a new task.
     * @return A future to retrieve the result later.
     */
    template <class F, class... Args>
    auto submit(F &&f, Args &&...args)
        -> std::future<typename std::invoke_result_t<F, Args...>>;

    /**
     * @brief Signal all threads to stop and join them during destruction.
     */
    ~ThreadPool();

  private:
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex queue_mutex_;
    std::condition_variable cond_;
    bool stop_ = false;
};
// function implementations ...
```

You can see how what would be split between `.hpp` and `.cpp` is now just in `.cppm`.

With this in my `CMakeLists.txt`:
```cmake
add_library(ThreadPool STATIC
    src/thread_pool.cppm
)

target_sources(ThreadPool
    PUBLIC
        FILE_SET CXX_MODULES
        FILES
            src/thread_pool.cppm
)
```

I can use `import ThreadPool` throughout my application to use the pre-compiled module.

### `constexpr` virtual functions

I've really enjoyed using these in  to move the mapping of custom enum `Error` variants to error messages to comptime.

With a pure virtual function `get_brief` defined in an abstract `Error` class:

```cpp
/**
 * @brief An abstract Error class.
 */
class Error {
  public:
    explicit Error(const std::string &file_name) : file_name_(file_name) {}

    virtual ~Error() = default;

    /**
     * @brief A constexpr to map inner error Type enumerators to
     * short titles for error output headings.
     */
    constexpr virtual std::string get_brief() const = 0;

    const std::string file_name_;
};
```

I can `constexpr` this:

```cpp
constexpr inline std::string ParserError::get_brief() const {
  return std::visit(
    [](auto &&arg) {
      using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, MalformedSectionHeader>)
          return "malformed section header";
        else if constexpr (std::is_same_v<T, ExpectedColonInHeaderAssignment>)
          return "missing colon in header assignment";
    },
    info_);
}
```

See also: [[#stdvariant|std::variant]] from C++17.

### `using enum`

When using enums, use scoped enums, and use `using enum`. This is the best way to handle scope namespace clashing with enums which is a common annoyance from C.

Consider this snippet without `using enum`:
```cpp
enum class Color { Red, Green, Blue };
void paint(Color c) {
    switch (c) {
        case Color::Red:
            std::cout << "Painting red.\n";
            break;
        case Color::Green:
            std::cout << "Painting green.\n";
            break;
        case Color::Blue:
            std::cout << "Painting blue.\n";
            break;
    }
}
```

And with:
```cpp
enum class Color { Red, Green, Blue };
using enum Color;
void paint(Color c) {
    switch (c) {
        case Red:
            std::cout << "Painting red.\n";
            break;
        case Green:
            std::cout << "Painting green.\n";
            break;
        case Blue:
            std::cout << "Painting blue.\n";
            break;
    }
}
```

## C++23

### `std::expected`

`std::expected` is similar to `std::optional`, but allows you to choose between a success value or an error value, not just a success value or `std::nullopt`.

Consider the same ThreadPool example from [[#modules|Modules]] above:
```cpp
std::vector<std::future<
    std::expected<CurlResponse, std::vector<std::unique_ptr<Error>>>>>
    futures;
```

The `std::expected` here expresses that the function within the future returns a `CurlResponse` on success and a vector of errors on failure.

### `if consteval`

`if consteval` makes comptime vs runtime branching clearer.

Imagine we're writing a program that wants to call a `square` function at comptime sometimes, **and** at runtime sometimes:
```cpp
constexpr int square_dispatch(int x) {
    if (std::is_constant_evaluated()) {
        return compile_time_square(x);
    } else {
        return fallback_square(x);
    }
}
```

It's a bit cleaner in our case to do:
```cpp
int square_dispatch(int x) {
    if consteval {
        return compile_time_square(x);
    } else {
        return x * x;
    }
}
```

### `std::unreachable`

`std::unreachable` is the C++ `std` way to do `__builtin_unreachable()`, or `__assume(false)` for those still using MSVC.

Consider:
```cpp
const char* color_to_string(Color c) {
    switch (c) {
        case Color::Red:   return "Red";
        case Color::Green: return "Green";
        case Color::Blue:  return "Blue";
    }
    std::unreachable(); // undefined behavior if we reach here
}
```
