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

      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            (pkgs.stdenv.mkDerivation {
              name = "corepack";
              buildInputs = [ pkgs.nodejs-18_x ];
              phases = [ "installPhase" ];
              installPhase = ''
                mkdir -p $out/bin
                corepack enable --install-directory=$out/bin
              '';
            })
          ];
        };
      });
}
