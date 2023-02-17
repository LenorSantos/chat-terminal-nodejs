import { default as axios } from "axios";
import { createInterface } from 'node:readline';
import express, { json } from "express";
import cors from "cors";
import aesjs from "aes-js";
const app = express();

app.use(cors());
app.use(json());
var port = 4001;
var nick;
var server;
const key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]; // key 256 bits
const key_256_buffer = Buffer.from(key);

const l1 = createInterface({
  input: process.stdin,
  output: process.stdout
});

l1.question("Digite seu nick: ", out => {
  nick = out;
  console.log(`Seu nick é "${nick}"`);

  l1.question("Digite o servidor ao qual deseja se conectar. 'Exemplo: meuservidor.com:80/chat': ", out => {
    server = out;

    console.log(`Porta padrão é ${port}`);
    l1.question("Digite a porta que deseja deixar aberta(apenas números, mas se digitado letras será aberto na porta padrão) ou pressione ENTER para usar a porta padrão: ", out => {
      var val = parseInt(out);

      if (isNaN(val)) {
        console.log("Not a Number");
        val = null;
      }

      if (val === null) {
        console.log("Porta não definida, seguindo com a porta padrão.");
        app.listen(port, () => {
          console.log(`Servidor aberto na porta ${port}`);
          console.log("Para sair digite o comando .exit");
          console.log(">>");
        });
      } else if (typeof val === "number" & val.toString().length > 0) {
        port = val;
        console.log(`Nova porta definida: ${port}`);
        app.listen(port, () => {
          console.log(`Servidor aberto na porta ${port}`);
          console.log("Para sair digite o comando .exit");
          console.log(">>");
        });
      }
    });
  });
});

app.post("/", (req, res) => {
  var encryptedBytes = aesjs.utils.hex.toBytes(req.body.msg);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key_256_buffer, new aesjs.Counter(10));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(`${req.body.nick}: ${decryptedText}`);
  res.end();
});

l1.on('line', (input) => {
  if (input === ".exit") {
    l1.close();
    app.listen().close((err) => {
      console.log('Chat fechado.');
      process.exit(err ? 1 : 0);
    });
  } else {
    var textBytes = aesjs.utils.utf8.toBytes(input);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key_256_buffer, new aesjs.Counter(10));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    axios.post(`http://${server}`, {
      nick: nick,
      msg: encryptedHex
    }).catch(err => {
      console.log("Usuário possivelmente desconectado ou servidor incorreto.");
    });
  }
});