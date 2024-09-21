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

### Sobre a animação:

A camera inicialmente está na posição (-15, 1, 0) olhando para o ponto (0, 0, 0);

Há uma bola de vidro na frente da câmera, ela inicialmente têm um índice de refração 1.5, mas esse valor vai diminuindo para gerar um efeito legal em algumas cenas;

Ao longo de 75 frames a câmera faz um movimento em formato de arco até chegar na posição (0, 10, 0), ainda olhando para o ponto (0, 0, 0);

Para tornar esse movimento possível, foi necessário alterar os valores que indicam qual orientação é para cima na câmera, sendo que ela começa em (0, 1, 0) e termina em (1, 0, 0);

Ao final desses 75 frames, é possível observar 15 bolas coloridas e a bola branca (de vidro descrita anteriormente);

Das 15 bolas coloridas 8 têm o material lambertian (azul, roxo, marrom, laranja, amarelo, vermelho, verde e preto) e 7 tem o material metal (azul, roxo, marrom, laranja, amarelo, vermelho, verde) com o fuzz igual a 0 para gerar um efeito de reflexão nas bolas de metal, sendo que elas estão distribuidas em formato de um triângulo;

A partir daqui, a camera fica parada nesse ponto por 90 frames, mostrando o resultado da colisão da bola branca com as outras bolas, fazendo com que todas elas se movam - essa movimentação foi feita manualmente, sendo que foi decidida a posição final delas e elas se movem aos poucos até essa posição em um loop.

Depois, a camera é movida para a posição (-7.5, 1, -4) para mostrar os efeitos da colisão por outro ângulo (90 frames). Além disso, a bola branca (de vidro) volta a ter um índice de refração 1.5 para gerar um efeito interessante.

Por fim, a camera é movida para a posição (4, 2.5, 0) para mostrar outra ângulo (90 frames). Dessa vez, o índice de refração da bola de vidro volta a ser 0 pelo mesmo motivo da anterior.

Os movimentos que as bolas fazem é o mesmo nessas 3 cenas.

### Sobre o WCS:

- O centro do mundo é o (0, 0, 0);
- O centro do triângulo com as 15 bolas está em (0, 1, 0), um pouco acima do centro do mundo;
  - A bola 1 (amarela, não metálica) está na posição (1.44, 1, -3);
  - A bola 2 (azul, não metálica) está na posição (2.88, 1, -4);
  - A bola 3 (vermelha, não metálica) está na posição (1.44, 1, -1);
  - A bola 4 (roxa, não metálica) está na posição (2.88, 1, -2);
  - A bola 5 (laranja, não metálica) está na posição (-1.44, 1, 1);
  - A bola 6 (verde, não metálica) está na posição (0, 1, -2);
  - A bola 7 (marrom, não metálica) está na posição (2.88, 1, 2);
  - A bola 8 (preta) está na posição (0, 1, 0), no centro do triângulo.
  - A bola 9 (amarela, metálica) está na posição (1.44, 1, 3);
  - A bola 10 (azul, metálica) está na posição (-2.88, 1, 0);
  - A bola 11 (vermelha, metálica) está na posição (-1.44, 1, -1);
  - A bola 12 (roxa, metálica) está na posição (0, 1, 2);
  - A bola 13 (laranja, metálica) está na posição (2.88, 1, -2);
  - A bola 14 (verde, metálica) está na posição (1.44, 1, 1);
  - A bola 15 (marrom, metálica) está na posição (2.88, 1, 0);
  - A bola branca (bola de vidro) está inicialmente na posição (10, 1, 0);
  - As posições citadas aqui referem-se ao centro da esfera, sendo que todas as esferas tem raio 1.
- Durante a animação, todas as bolas mudam de posição.

Para essa animação, é conveniente que o triângulo com as bolas fique no centro do mundo, pois como ele é o foco, se a câmera continuar apontando apra (0, 0, 0) durante toda a animação não terá nenhum problema.

### Sobre o código:

O código base utilizado foi o sugerido na especificação do projeto ([Ray Tracing em um final de semana](https://raytracing.github.io/books/RayTracingInOneWeekend.html)), sendo que foi necessário fazer uma pequena alteração na função de renderização da camera.

O código de renderização da camera foi modificado para receber um inteiro que vai indicar o número do frame, e agora, ao invés de imprimir os valores dos pixels no terminal, eles serão escritos em um arquivo com o nome "image_x", sendo x o número do frame recebido.

Dessa forma, foi possível gerar os 345 frames sem muitas complicações. No fim, eles foram transformados em um vídeo usando o FFMPEG:

```bash
ffmpeg -framerate 30 -start_number 0 -i "image%d.ppm" output.mp4
ffmpeg -i output.mp4 -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p raytracing.mp4
```

---


## _WebGL2_

O nosso projeto de WebGL2 consiste na recriação de um personagem desenvolvido para um [Jogo](https://asteriskoobelisko.itch.io/umjogo-to-mal-feito-que-eu-fui-puxado-para-dentro-dele-e-no-sei-o-que-eu-estoufa) para a Maritacas Gamedev pelo integrante Leonardo Prado e um modelo de banana criado exclusivamente para esse trabalho (Ninguém sabe porquê, mas bananas são engraçadas).

Este projeto contém todos os adicionais possíveis requisitados (texturas, iluminação e movimentos indepententes) em ambos os objetos.

**Arquivos:**

- index.html: Contém o canvas qual está sendo reproduzido.

- main.js: Javascript contendo todo a funcionalidade webGL2.

- main.css: Estética da página.

- jorgin.obj: Objeto humanoide de cor azul.

- jorgin.mtl: Arquivo Material Template Library associado ao objeto jorgin.obj.

- jorgin_texture.png: Textura em formato png do objeto jorgin.obj.

- banana.obj: Objeto em formato de banana.

- banana.mtl: Arquivo Material Template Library associado ao objeto banana.obj.

- banana_texture.png: Textura em formato png do objeto banana.obj.


**Textura:**

As texturas em ambos arquivos .obj são armazenados nos arquivos png jorgin_texture.png e banana_texture.png e são mapeadas com as informações de coordenadas fornecidas pelo .mtl dos objetos, na linha map_kd texture.png

**Iluminação:**

O .mtl respectivo dos objetos contém as informações das propriedades de refletividade dos mesmos. O comportamento real da luz (como ela reflete, sombras, etc.) é determinado pelo mecanismo de renderização do WebGL2, no caso o fragmentshader(fs) e o vertexshader (vs)

**Movimentos Independentes:**

Os objetos possuem movimentação diferente para cada um, o jorgin.obj descreve uma rotação em seu eixo Y e um movimento de translação para cima e para baixo enquanto o banana.obj utiliza uma rotação periódica em todos os eixos.

Para executar esse projeto é necessário abrir um terminal na pasta Webgl2 e digitar o seguinte comando:

```bash
python -m http.server 8000
```


Após isso, abra um navegador e acesse a página [localhost:8000](http://localhost:8000/) para visualizar o resultado.

De qualquer forma o resultado está presente aqui abaixo:

![video2](./results/webgl.gif)