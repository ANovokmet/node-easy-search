# node-easy-search

A simple utility to search files. Useful on Windows at least.

## Installation

1. Clone repository
2. Navigate to folder
3. `npm i --global`
4. Use the `search` command in CMD

## Usage

### Find all .cs files

```
search -glob **/*.cs
```

### Find all files with file name matching regex

```
search -glob * -r 'Log-\d+.txt'
```

### Find all files with content matching regex

```
search -glob * -s 'The amount is \$\d{3}'
```

### Output results as a html page


```
search -glob **/*.cs -html true
```

