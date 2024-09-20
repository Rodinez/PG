## _Ray Tracing_

O nosso projeto de ray tracing consiste em 345 frames gerados para uma animação de bilhar, contendo 3 ângulos de câmeras diferentes no momento da colisão das bolas.

Inicialmente, para compilar o programa, é necessário que se abra um terminal na pasta ray_tracing e digite o comando make para gerar um arquivo executável raytracing.exe

Para gerar todos os frames dessa animação com o valor de 300 em cam.samples_per_pixel pode-se utilizar o seguinte comando:

```bash
./raytracing.exe
```


No entanto, a nossa implementação pode ser utilizada com argumentos a nível de linha de comando, com o programa podendo ser chamado das seguintes maneiras:

```bash
./raytracing.exe 10
```


Que setará o valor de cam.samples_per_pixel para o argumento passado, nesse caso 10. Ou:

```bash
./raytracing.exe 100 115
```


Que terá como saída os frames a partir do primeiro argumento até o segundo (não incluso) com o valor de cam.samples_per_pixel igual a 300. Nesse caso a saída seriam os frames 100 ao 114 da animação.

```bash
./raytracing.exe 0 50 10
```


Que terá como saída os frames a partir do primeiro argumento até o segundo (não incluso) com cam.samples_per_pixel igual ao terceiro argumento. Nesse caso o programa teria como saída os frames 0 ao 49 da animação com 10 de valor no cam.samples_per_pixel.

O resultado final está presente logo a baixo:

![video1](./results/raytracing.gif)

_Para uma vizualização mais detalhada, aconselha-se consultar o arquivo raytracing.mp4 contido no diretório results_


---


## _WebGL2_

O nosso projeto de WebGL2 consiste na recriação de um personagem desenvolvido para um [Jogo](https://asteriskoobelisko.itch.io/umjogo-to-mal-feito-que-eu-fui-puxado-para-dentro-dele-e-no-sei-o-que-eu-estoufa) para a Maritacas Gamedev pelo integrante Leonardo Prado e um modelo de banana criado exclusivamente para esse trabalho (Ninguém sabe porquê, mas bananas são engraçadas).

Para executar esse projeto é necessário abrir um terminal na pasta Webgl2 e digitar o seguinte comando:

```bash
python -m http.server 8000
```


Após isso, abra um navegador e acesse a página [localhost:8000](http://localhost:8000/) para visualizar o resultado.

De qualquer forma o resultado está presente aqui abaixo:

![video2](./results/webgl.gif)
