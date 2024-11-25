set dotenv-load := false

# Show all available recipes
@default:
    just --list --unsorted


###########
# Version #
###########

export NODE_VERSION := `grep 'node": ">= ' package.json | awk -F'>= ' '{print $2}' | awk -F'.' '{print $1}'`

# Print the Node.js version specified in `package.json`
@node-version:
    echo $NODE_VERSION


###############
# Development #
###############

# Install dependencies
install:
    npm install

alias i := install

# Generate static files
generate:
    node ./generate.js

# Serve static files
serve:
    npm run serve

# Watch for changes and regenerate static files
watch: install generate
    npm run watch

# See: https://stackoverflow.com/a/52033580
# Had to change SIGINT to INT for `sh` compatibility
[doc('Spin up both the watcher and the server')]
up:
    (trap 'kill 0' INT; just watch & just serve)

# Run prettier
lint check="":
    npm run prettier -- {{ if check == "" { "--write" } else { "--check" } }}
