# aetherunbound.net

## Installation & Building

### Prerequisites

- [`just`](https://just.systems/)
- [`node`](https://nodejs.org/en/) (see `just node-version` for which version to install)

### For development

1. `just install`
2. `just up`

### To build for publishing

1. `just install`
2. `just generate`

### Linting

Run `just lint` to run `prettier` (and any future linting steps) on the project.
For CI purposes, `just lint check` will return a non-zero exit code if there are any linting errors.