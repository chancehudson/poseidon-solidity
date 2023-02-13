#!/bin/sh

set -e

NAME=SOLC_COMPILER

rm -rf build

docker run \
  --rm \
  --name $NAME \
  -v ${PWD}:/src \
  -w /src \
  ethereum/solc:stable \
  --optimize --optimize-runs=99999 \
  --abi --bin -o /src/build \
  contracts/Poseidon.sol \
  --base-path /src --allow-paths /src/contracts
