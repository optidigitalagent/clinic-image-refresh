# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Система заявок: GitHub Pages → Railway → Telegram

Опубликованная форма отправляет `name`, `phone` и необязательный `comment` в сервис
`bot/server.mjs`. Сервис проверяет данные, ограничивает частоту запросов и отправляет
заявку напрямую через Telegram Bot API. Токен бота никогда не попадает в браузер или
GitHub Pages.

### Переменные Railway

- `TELEGRAM_BOT_TOKEN` — токен от BotFather.
- `TELEGRAM_CHAT_ID` — ID личного чата или группы, куда должны приходить заявки.
- `ALLOWED_ORIGINS` — разрешённые адреса сайта через запятую. Для текущего сайта:
  `https://optidigitalagent.github.io`. При подключении домена добавьте его сюда.

Railway использует `railway.json`, запускает `npm run start:railway`, слушает выданный
порт на `0.0.0.0` и проверяет `/health` перед переключением трафика.

После генерации публичного Railway-домена добавьте в GitHub Actions repository variable:

```text
VITE_APPOINTMENTS_API_URL=https://your-service.up.railway.app
```

Затем повторно запустите workflow `Deploy GitHub Pages`. Для локальной проверки доступны:

```sh
npm run test:bot
npm run build:pages
```
