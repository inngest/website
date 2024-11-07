{
  description = "Inngest Website Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
        corepack = pkgs.stdenv.mkDerivation {
          name = "corepack";
          buildInputs = [ pkgs.nodejs-18_x ];
          phases = [ "installPhase" ];
          installPhase = ''
            mkdir -p $out/bin
            corepack enable --install-directory=$out/bin
          '';
        };

      in {
        devShells.default = pkgs.mkShell {
          packages = [ corepack ];

          nativeBuildInputs = with pkgs; [
            typescript
            nodejs_20

            nodePackages.typescript-language-server
            nodePackages.vscode-json-languageserver
            nodePackages.yaml-language-server
          ];
        };
      });
}
