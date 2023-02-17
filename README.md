# chat-terminal-nodejs
 Chat via terminal utilizando NodeJS com criptografia

## Configurar

É necessário definir nome de usuário, servidor a qual deseja se conectar e a porta, mas caso deseje utilizar a porta padrão é só teclar ENTER (`porta padrão é 4001`).

Caso digite letras ou apenas tecla ENTER quando for definir a porta ele vai exibir o erro `not a number` e vai configurar a porta padrão.

## Utilização

No terminal digite os seguintes comandos:

#### Instalar os pacotes
```
  npm install
```

#### Rodar o programa
```
  node ./chat.js
```

## Documentação

#### Recebe as mensagens e o nick do usuário

```http
  POST /
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `req.body.msg` | `string` | Recebe a mensagem criptografada |
| `req.body.nick` | `string` | Recebe o nome do usuário |

A mensagem é descriptografada somente antes de ser formatada para aparecer no console.

#### Enviando mensagem

Como já foi realizado configuração não é preciso mais se preocupar por aqui, apenas digite sua mensagem normalmente no console e tecle ENTER para enviar.

Axios vai enviar:

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `{nick: nick}`      | `string` | Nick do usuário |
| `{msg: encryptedHex}` | `string` | Mensagem criptografada |

A mensagem é criptografada antes de ser enviada.
`A criptografia utilizada é AES-256 bits`

## Possiveis erros

Caso o servidor esteja errado ele vai exibir esse erro: `Usuário possivelmente desconectado ou servidor incorreto.` Ainda não é possivel checar se o servidor esta ativo ou existe antes de abrir o chat, fica para uma atualização futura.