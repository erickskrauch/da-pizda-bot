> *10 лет профессионального опыта разработки привели меня сюда...*

# Да-Пизда бот

<details>
  <summary>Шутка, которая зашла слишком далеко</summary>

  > **X**: Эрик) знаешь такую шутку
  >
  > **X**:
  > Да
  > 
  > Пизда
  >
  > **ErickSkrauch**: X? xD
  >
  > **X**: Я просто заебался после слов да людям отвечать пизда)
  >
  > **X**: Хочу бот такой написать) добавляешь в чат
  >
  > **X**: И после каждого да бот автоматом пишет пизда))
  >
  > **ErickSkrauch**: Звучит как стартап на миллион xD
</details>

Если вы сталкивались с подобной проблемой, то этот бот определённо готов вам помочь. Просто добавьте его в свою любимую группу и наслаждайтесь:

* [Telegram](https://t.me/DaPiAnswerBot?startgroup)
* [Discord](https://discord.com/api/oauth2/authorize?client_id=1226219373375656036&permissions=3072&scope=bot)

Бот обучен некоторым особым приёмам и распознаёт простые методы обхода. Если у вас есть идеи, как его улучшить ещё больше, то, пожалуйста, [создайте issue](https://github.com/erickskrauch/da-pizda-bot/issues/new).

## Развёртывание

Если вы хотите использовать готового бота, то воспользуйтесь ссылками выше.

### Локальный запуск

Бот легко может быть запущен из исходного кода. Для запуска вам понадобится установленный [git](https://git-scm.com/downloads), [Node.js v20](https://nodejs.org/en/download) и [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/). Когда необходимый софт будет установлен и доступен в консоли, откройте её и выполните следующие команды:

```sh
# Клонируем репозиторий бота
git clone https://github.com/erickskrauch/da-pizda-bot.git
# Переходим в его папку
cd da-pizda-bot
# Устанавливаем зависимости
yarn install
# Подготавливаем конфигурацию
cp .env.dist .env
```

После этого необходимо отредактировать файл `.env` и заменить `xxxxx` значения на ваши токены ботов. Как их получить [читайте ниже](#регистрация-ботов). Если какой-то из ботов вам не нужен, полностью сотрите его строку.

Когда токены будут введены, можно запустить бота командой:

```sh
yarn start
```

### Docker

Проект имеет сборку в виде образа Docker и опубликован на [Dockerhub](https://hub.docker.com/r/erickskrauch/da-pizda-telegram-bot). Вы можете запустить его одной командой (заменив токены на свои):

```sh
docker run -d --name da-pizda -e TELEGRAM_BOT_TOKEN=xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -e DISCORD_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx erickskrauch/da-pizda-telegram-bot:latest
```

Или же с помощью `docker-compose`. Для этого создайте файл `docker-compose.yml` с таким содержимым (замените токены на свои!):

```yml
version: "3"
services:
  bot:
    image: erickskrauch/da-pizda-telegram-bot:latest
    restart: unless-stopped
    environment:
      TELEGRAM_BOT_TOKEN: xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      DISCORD_BOT_TOKEN: xxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

После чего откройте терминал в папке с файлом и выполните:

```sh
docker-compose up -d
```

## Регистрация ботов

### Telegram

1. Перейдите в чат с [BotFather](https://t.me/BotFather).
1. Впишите команду `/newbot` и следуйте инструкции.
1. После того, как бот будет создан, введите команду `/mybots` и выберите новосозданного бота.
1. Выберите `Bot Settings`, затем `Group Privacy` и нажмите `Turn off`. Это необходимо, чтобы бот имел доступ к сообщениям.
1. После этого выберите `Back to Settings`, `Back to Bot` и выберите `API Token`. 
1. Скопируйте полученный токен в конфигурацию бота.
1. Чтобы добавить бота в чат, откройте переписку с ним (можно найти через поиск по юзернейму бота), кликните на его имя вверху диалога и выберите пункт `Добавить в группу`/`Add to Group`.

### Discord

1. Перейдите на [страницу управления приложениями Discord](https://discord.com/developers/applications).
1. Нажмите `New Application`, впишите желаемое имя и согласитесь с правилами.
1. На странице новосозданного бота перейдите в раздел `Bot` и отметьте привилегии `Server Members Intent` и `Message Content Intent`.
1. Нажмите `Save Changes`.
1. Не уходя с этой же страницы, нажмите на кнопку `Reset Token`.
1. Скопируйте полученный токен в конфигурацию бота.
1. Чтобы добавить бота на сервер, необходимо сформировать ссылку:
   ```
   https://discord.com/api/oauth2/authorize?client_id={{applicationId}}&permissions=3072&scope=bot
   ```
   Где `{{applicationId}}` — это `APPLICATION ID` со страницы `General Information` бота.
