Zabbix 5.0 to Telegram 6.8 JS script
==
in extend of manual: `https://git.zabbix.com/projects/ZBX/repos/zabbix/browse/templates/media/telegram?at=release/5.0`

- add parameter "topic" to send message to specific Telegram Group Topic

Custom alerts, add parameters:
- `HTTPProxy` *optional* string - url to proxy
- `parseMode` *optional* string- html, markdown, markdownv2
- `Topic` *optional* integer - tread id of group chat
- `Token` *required* string - API token telegram bot
- `To` *required* integer - user/group chat_id
- `Subject` *required* string - subject of message
- `Message` *required* string - text message