# Safecoin Starter Web App 

## Stack

- Typescript
- Vite
- React
- MaterialUI (MUI)
- Safecoin

Devtools：

- Eslint
- Prettier
- Jest

## Features
  
  - Safecoin wallet
  - wallet UI implemented in react with mui
  - wallet provider to track wallet connection status
  - connect provider to track cluster/network connection
  - theme provider 
  - light/dark mode provider
  - application toolbar with wallet/network + light/dark theme control
  - token provider (configure available tokens w/json)
  - token drawer component - makes app-specific tokens + token faucet easier

## Work Arounds

* polyfill for Buffer

## Installation

```{bash}
# install pnpm
https://pnpm.io/installation

# pnpm has the same usage of npm
pnpm install
```

## Start

```{bash}
# dev
pnpm run dev

# production
pnpm run build
pnpm run serve
```

``
