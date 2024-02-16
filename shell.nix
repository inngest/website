{ pkgs ? import <nixos-23.11> {} }:

let
  corepack = pkgs.stdenv.mkDerivation {
    name = "corepack";
    buildInputs = [ pkgs.nodejs-18_x ];
    phases = [ "installPhase" ];
    installPhase = ''
      mkdir -p $out/bin
      corepack enable --install-directory=$out/bin
    '';
  };

in pkgs.mkShell { packages = [ corepack ]; }
