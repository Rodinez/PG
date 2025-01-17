#include "rtweekend.h"

#include "camera.h"
#include "hittable.h"
#include "hittable_list.h"
#include "material.h"
#include "sphere.h"

//Desenvolvido por:
//Fidel Cassio Santos Pereira - 813264
//Gabriel Santos de Andrade - 815407
//Jean Rodrigues Rocha - 813581
//Leonardo Prado Silva - 813169


int main(int argc, char** argv) {
    //cria um mundo e uma camera
	hittable_list world;
	camera cam;
	
    cam.aspect_ratio      = 16.0 / 9.0;
    cam.image_width       = 1280;
	
    if (argc == 2)
		cam.samples_per_pixel = std::stoi(argv[1]);
	else if (argc == 4)
		cam.samples_per_pixel = std::stoi(argv[3]);
	else
		cam.samples_per_pixel = 300; // se nenhum argumento for passado ao executar o programa, será gerada uma imagem com 300 samples por pixel
	
    cam.max_depth         = 20;
	
	
	cam.vfov     = 90;
    cam.lookfrom = point3(-15,1,0); //posição inicial da camera
    cam.lookat   = point3(0,0,0);
    cam.vup      = vec3(0,1,0);
    cam.defocus_angle = 0.6;
    cam.focus_dist    = 10.0;
	
	int total_frames = 0; //valor usado para fazer as animações
	
	
	
	//O material das bolas numeradas (1-15) não muda, então todas podem ser declaradas antes dos loops das animações
	auto ball10 = make_shared<metal>(color(0, 0, 1), 0); //fuzz 0 para refletir mais coisas
	
	auto ball11 = make_shared<metal>(color(1, 0, 0), 0);
	auto ball5 = make_shared<lambertian>(color(1, 0.25, 0.03));
	
	auto ball6 = make_shared<lambertian>(color(0, 1, 0));
	auto ball8 = make_shared<lambertian>(color(0, 0, 0));
	auto ball12 = make_shared<metal>(color(0.6, 0, 0.75), 0);
	
	auto ball1 = make_shared<lambertian>(color(1, 1, 0));
	auto ball3 = make_shared<lambertian>(color(1, 0, 0));
	auto ball14 = make_shared<metal>(color(0, 1, 0), 0);
	auto ball9 = make_shared<metal>(color(1, 1, 0), 0);
	
	auto ball15 = make_shared<metal>(color(0.47, 0.25, 0.03), 0);
	auto ball7 = make_shared<lambertian>(color(0.47, 0.25, 0.03));
	auto ball13 = make_shared<metal>(color(1, 0.25, 0.03), 0);
	auto ball4 = make_shared<lambertian>(color(0.6, 0, 0.75));
	auto ball2 = make_shared<lambertian>(color(0, 0, 1));
	
	auto ground_material = make_shared<lambertian>(color(0, 0.76, 0.29));
	
	//faz um loop para gerar os primeiros 75 frames, nesse tempo, a bola branca vai se mover até as outras e a camera vai se mover até (0, 10, 0)
	for (auto i = total_frames, frames = 75, initial = total_frames; i < initial + frames; i++) {		
		
		//nessas próximas linhas, todos os world.add adicionam os objetos no mundo nas posições desejadas
		world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));
		
		world.add(make_shared<sphere>(point3(-2.88, 1, 0), 1.0, ball10));
		
		
		
		world.add(make_shared<sphere>(point3(-1.44, 1, -1), 1.0, ball11));
		
		world.add(make_shared<sphere>(point3(-1.44, 1, 1), 1.0, ball5));


		
		world.add(make_shared<sphere>(point3(0, 1, -2), 1.0, ball6));
		
		world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, ball8));
		
		world.add(make_shared<sphere>(point3(0, 1, 2), 1.0, ball12));
		

		
		world.add(make_shared<sphere>(point3(1.44, 1, -3), 1.0, ball1));
		
		world.add(make_shared<sphere>(point3(1.44, 1, -1), 1.0, ball3));
		
		world.add(make_shared<sphere>(point3(1.44, 1, 1), 1.0, ball14));
		
		world.add(make_shared<sphere>(point3(1.44, 1, 3), 1.0, ball9));
		

		
		world.add(make_shared<sphere>(point3(2.88, 1, 0), 1.0, ball15));
		
		world.add(make_shared<sphere>(point3(2.88, 1, 2), 1.0, ball7));
		
		world.add(make_shared<sphere>(point3(2.88, 1, 4), 1.0, ball13));
		
		world.add(make_shared<sphere>(point3(2.88, 1, -2), 1.0, ball4));
		
		world.add(make_shared<sphere>(point3(2.88, 1, -4), 1.0, ball2));


		auto ball_white = make_shared<dielectric>(std::max((1.5 - 3./frames * (i-initial)), 0.)); //gera um novo video com índice de refração menor a cada frame, sendo que ele será no mínimo 0
		world.add(make_shared<sphere>(point3(-10 + 6.12/frames * (i-initial), 1, 0), 1.0, ball_white)); //a posição em que a bola branca será inserida no mundo depende do frame atual, gerando um movimento
		
		
		//renderiza o frame atual, passando o i como argumento para gerar a imagem referente ao frame.
		//se forem passados 2 ou 3 argumentos ao executar o programa, ele só vai gerar os frames no intervalo especificado nos 2 primeiros argumentos (que espera-se que sejam números)
		if (argc >= 3) {
			if (i >= std::stoi(argv[1]) && i < std::stoi(argv[2]))
				cam.render(world, i);
		} else
			cam.render(world, i);
		
		
		//atualiza a posição e o vetor que indica o lado de cima da camera
		if (i >= 15) {
			cam.lookfrom += point3(15./(frames-15), 9./(frames-15), 0);
			cam.vup += point3(1./(frames-15), -1./(frames-15), 0);
		}
		
		world.clear();
		total_frames++;
	}
	
	
	
	//gera os frames do 75 ao 165, onde é possível ver o resultado da colisão das bolas
	for (auto i = total_frames, frames = 90, initial = total_frames; i < initial + frames; i++) {		
		point3 start;
		point3 end;
		
		//a camera vai ficar parada nessa cena
		cam.lookfrom = point3(0,10,0);
		cam.vup      = vec3(1,0,0);

		world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));
		
		//para adicionar as bolas no mundo é definida a posição inicial e a final, com base nisso calcula-se a posição da bola no frame atual.
		start = point3(-2.88, 1, 0);
		end = point3(1.5, 1, 1.5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball10));
		
		
		
		start = point3(-1.44, 1, -1);
		end = point3(0, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball11));

		start = point3(-1.44, 1, 1);
		end = point3(3, 1, 4);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball5));
		


		start = point3(0, 1, -2);
		end = point3(4, 1, -10);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball6));

		start = point3(0, 1, 0);
		end = point3(3, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball8));

		start = point3(0, 1, 2);
		end = point3(6, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball12));

		

		start = point3(1.44, 1, -3);
		end = point3(9, 1, -7);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball1));

		start = point3(1.44, 1, -1);
		end = point3(10, 1, -3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball3));

		start = point3(1.44, 1, 1);
		end = point3(7, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball14));

		start = point3(1.44, 1, 3);
		end = point3(5, 1, 6);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball9));
		
		

		start = point3(2.88, 1, -4);
		end = point3(14, 1, -8);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball2));
		

		start = point3(2.88, 1, -2);
		end = point3(13, 1, -5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball4));

		start = point3(2.88, 1, 0);
		end = point3(15, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball15));

		start = point3(2.88, 1, 2);
		end = point3(9, 1, 3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball7));

		start = point3(2.88, 1, 4);
		end = point3(7, 1, 9);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball13));
		
		
		//a bola branca tem índice de refração 0 para ficar mais visível com a posição atual da camera
		auto ball_white = make_shared<dielectric>(0);
		start = point3(-3.88, 1, 0);
		end = point3(-4.5, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball_white));
		
		if (argc >= 3) {
			if (i >= std::stoi(argv[1]) && i < std::stoi(argv[2]))
				cam.render(world, i);
		} else
			cam.render(world, i);
		world.clear();
		
		total_frames++;
	}
	
	//gera os frames do 165 ao 255, onde é possível ver o resultado da colisão das bolas de um angulo diferente, perto de onde a bola branca para
	for (auto i = total_frames, frames = 90, initial = total_frames; i < initial + frames; i++) {		
		point3 start;
		point3 end;
		
		//a camera vai ficar parada nessa cena
		cam.lookfrom = point3(-7.5,1,-4);
		cam.vup      = vec3(0,1,0);

		world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));

		//para adicionar as bolas no mundo é definida a posição inicial e a final, com base nisso calcula-se a posição da bola no frame atual.
		start = point3(-2.88, 1, 0);
		end = point3(1.5, 1, 1.5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball10));
		


		start = point3(-1.44, 1, -1);
		end = point3(0, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball11));

		start = point3(-1.44, 1, 1);
		end = point3(3, 1, 4);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball5));
		
		

		start = point3(0, 1, -2);
		end = point3(4, 1, -10);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball6));

		start = point3(0, 1, 0);
		end = point3(3, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball8));

		start = point3(0, 1, 2);
		end = point3(6, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball12));



		start = point3(1.44, 1, -3);
		end = point3(9, 1, -7);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball1));

		start = point3(1.44, 1, -1);
		end = point3(10, 1, -3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball3));
		
		start = point3(1.44, 1, 1);
		end = point3(7, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball14));
		
		start = point3(1.44, 1, 3);
		end = point3(5, 1, 6);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball9));
		
		
		
		start = point3(2.88, 1, -4);
		end = point3(14, 1, -8);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball2));
		
		start = point3(2.88, 1, -2);
		end = point3(13, 1, -5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball4));
		
		start = point3(2.88, 1, 0);
		end = point3(15, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball15));
		
		start = point3(2.88, 1, 2);
		end = point3(9, 1, 3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball7));
		
		start = point3(2.88, 1, 4);
		end = point3(7, 1, 9);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball13));
		
		
		//o índice de refração voltou a ser 1.5 pois a bola branca é muito visível nessa posição, então é mais legal caso seja possível ver através dela.
		auto ball_white = make_shared<dielectric>(1.5);
		start = point3(-3.88, 1, 0);
		end = point3(-4.5, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball_white));
		
		if (argc >= 3) {
			if (i >= std::stoi(argv[1]) && i < std::stoi(argv[2]))
				cam.render(world, i);
		} else
			cam.render(world, i);
		world.clear();
		
		total_frames++;
	}
    
	//gera os frames do 255 ao 345, onde é possível ver o resultado da colisão das bolas de um angulo diferente, um pouco atrás e acima das bolas
	for (auto i = total_frames, frames = 90, initial = total_frames; i < initial + frames; i++) {		
		point3 start;
		point3 end;
		
		//a camera vai ficar parada nessa cena
		cam.lookfrom = point3(4,2.5,0);
		cam.vup      = vec3(0,1,0);

		world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));

		//para adicionar as bolas no mundo é definida a posição inicial e a final, com base nisso calcula-se a posição da bola no frame atual.
		start = point3(-2.88, 1, 0);
		end = point3(1.5, 1, 1.5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball10));

		

		start = point3(-1.44, 1, -1);
		end = point3(0, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball11));

		start = point3(-1.44, 1, 1);
		end = point3(3, 1, 4);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball5));



		start = point3(0, 1, -2);
		end = point3(4, 1, -10);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball6));

		start = point3(0, 1, 0);
		end = point3(3, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball8));

		start = point3(0, 1, 2);
		end = point3(6, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball12));
		


		start = point3(1.44, 1, -3);
		end = point3(9, 1, -7);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball1));

		start = point3(1.44, 1, -1);
		end = point3(10, 1, -3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball3));
		
		start = point3(1.44, 1, 1);
		end = point3(7, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball14));
		
		start = point3(1.44, 1, 3);
		end = point3(5, 1, 6);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball9));
		
		
		
		start = point3(2.88, 1, -4);
		end = point3(14, 1, -8);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball2));
		
		start = point3(2.88, 1, -2);
		end = point3(13, 1, -5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball4));
		
		start = point3(2.88, 1, 0);
		end = point3(15, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball15));
		
		start = point3(2.88, 1, 2);
		end = point3(9, 1, 3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball7));
		
		start = point3(2.88, 1, 4);
		end = point3(7, 1, 9);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball13));
		
		
		//o índice voltou a ser 0 nessa cena pois isso deixa ela mais legal.
		auto ball_white = make_shared<dielectric>(0);
		start = point3(-3.88, 1, 0);
		end = point3(-4.5, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball_white));
		
		if (argc >= 3) {
			if (i >= std::stoi(argv[1]) && i < std::stoi(argv[2]))
				cam.render(world, i);
		} else
			cam.render(world, i);
		world.clear();
		
		total_frames++;
	}
	
}
