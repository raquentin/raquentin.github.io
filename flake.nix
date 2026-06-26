{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = {
    systems,
    nixpkgs,
    ...
  }: let
    eachSystem = f: nixpkgs.lib.genAttrs (import systems) (system: f nixpkgs.legacyPackages.${system});
  in {
    devShells = eachSystem (pkgs: {
      default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs
        ];
      };
    });

    packages = eachSystem (pkgs: {
      default = pkgs.buildNpmPackage {
        pname = "raquentin-site";
        version = "0.0.1";
        src = ./site;
        # Run `nix build` once with this placeholder; replace with the hash from the error message.
        npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
        NODE_ENV = "production";
        buildPhase = "npm run build";
        installPhase = "cp -r build $out";
      };
    });
  };
}
