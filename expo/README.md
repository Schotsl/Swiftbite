# Update dependencies

## 1. Update every dependency

bun update --latest

## 2. Update Expo dependencies to supported versions

bunx expo install --fix

# 3. Validate updates

bunx expo-doctor
bunx tsc --noEmit

bun run lint
bun run format
