#include "rtweekend.h"

#include "camera.h"
#include "hittable.h"
#include "hittable_list.h"
#include "material.h"
#include "sphere.h"


int main() {
    hittable_list world;

    auto ground_material = make_shared<lambertian>(color(0, 0.76, 0.29));
    world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));

    camera cam;
	
	
    cam.aspect_ratio      = 16.0 / 9.0;
    cam.image_width       = 800;
    cam.samples_per_pixel = 25;
    cam.max_depth         = 20;
	
	
	/*
    cam.vfov     = 90;
    cam.lookfrom = point3(0,10,0);
    cam.lookat   = point3(0,0,0);
    cam.vup      = vec3(1,0,0);
	*/
	
	
	cam.vfov     = 90;
    cam.lookfrom = point3(-15,1,0);
    cam.lookat   = point3(0,0,0);
    cam.vup      = vec3(0,1,0);
	
	
    cam.defocus_angle = 0.6;
    cam.focus_dist    = 10.0;
	
	
	for (auto i = 0, frames = 60; i < 60; i++) {		
		auto ground_material = make_shared<lambertian>(color(0, 0.76, 0.29));
		world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));
		
		auto ball10 = make_shared<metal>(color(0, 0, 1), 0.5);
		world.add(make_shared<sphere>(point3(-2.88, 1, 0), 1.0, ball10));
		
		
		
		
		
		
		auto ball11 = make_shared<metal>(color(1, 0, 0), 0.5);
		world.add(make_shared<sphere>(point3(-1.44, 1, -1), 1.0, ball11));
		
		auto ball5 = make_shared<lambertian>(color(1, 0.25, 0.03));
		world.add(make_shared<sphere>(point3(-1.44, 1, 1), 1.0, ball5));
		
		
		
		
		
		
		auto ball6 = make_shared<lambertian>(color(0, 1, 0));
		world.add(make_shared<sphere>(point3(0, 1, -2), 1.0, ball6));
		
		auto ball8 = make_shared<lambertian>(color(0, 0, 0));
		world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, ball8));
		
		auto ball12 = make_shared<metal>(color(0.6, 0, 0.75), 0.5);
		world.add(make_shared<sphere>(point3(0, 1, 2), 1.0, ball12));
		
		
		
		
		
		
		auto ball1 = make_shared<lambertian>(color(1, 1, 0));
		world.add(make_shared<sphere>(point3(1.44, 1, -3), 1.0, ball1));
		
		auto ball3 = make_shared<lambertian>(color(1, 0, 0));
		world.add(make_shared<sphere>(point3(1.44, 1, -1), 1.0, ball3));
		
		auto ball14 = make_shared<metal>(color(0, 1, 0), 0.5);
		world.add(make_shared<sphere>(point3(1.44, 1, 1), 1.0, ball14));
		
		auto ball9 = make_shared<metal>(color(1, 1, 0), 0.5);
		world.add(make_shared<sphere>(point3(1.44, 1, 3), 1.0, ball9));
		
		
		
		
		
		
		auto ball15 = make_shared<metal>(color(0.47, 0.25, 0.03), 0.5);
		world.add(make_shared<sphere>(point3(2.88, 1, 0), 1.0, ball15));
		
		auto ball7 = make_shared<lambertian>(color(0.47, 0.25, 0.03));
		world.add(make_shared<sphere>(point3(2.88, 1, 2), 1.0, ball7));
		
		auto ball13 = make_shared<metal>(color(1, 0.25, 0.03), 0.5);
		world.add(make_shared<sphere>(point3(2.88, 1, 4), 1.0, ball13));
		
		auto ball4 = make_shared<lambertian>(color(0.6, 0, 0.75));
		world.add(make_shared<sphere>(point3(2.88, 1, -2), 1.0, ball4));
		
		auto ball2 = make_shared<lambertian>(color(0, 0, 1));
		world.add(make_shared<sphere>(point3(2.88, 1, -4), 1.0, ball2));
		
		
		
		
		
		auto ball_white = make_shared<dielectric>(1.5);
		world.add(make_shared<sphere>(point3(-10 + 6.12/60. * i, 1, 0), 1.0, ball_white));
		
		cam.render(world, i);
		cam.lookfrom += point3(15./frames, 9./frames, 0);
		cam.vup += point3(1./frames, -1./frames, 0);
		
		
		
		world.clear();
		
		std::cout << -10 + 6.12/frames * i << "\n";
	}
	
	
	
	
	for (auto i = 60, frames = 120, initial = 60; i < 180; i++) {		
		point3 start;
		point3 end;
		
		cam.lookfrom = point3(0,10,0);
		cam.vup      = vec3(1,0,0);
		
		auto ground_material = make_shared<lambertian>(color(0, 0.76, 0.29));
		world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));
		
		auto ball10 = make_shared<metal>(color(0, 0, 1), 0.5);
		start = point3(-2.88, 1, 0);
		end = point3(1.5, 1, 1.5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball10));
		
		
		
		
		
		
		auto ball11 = make_shared<metal>(color(1, 0, 0), 0.5);
		start = point3(-1.44, 1, -1);
		end = point3(0, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball11));
		
		auto ball5 = make_shared<lambertian>(color(1, 0.25, 0.03));
		start = point3(-1.44, 1, 1);
		end = point3(3, 1, 4);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball5));
		
		
		
		
		
		
		auto ball6 = make_shared<lambertian>(color(0, 1, 0));
		start = point3(0, 1, -2);
		end = point3(4, 1, -10);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball6));
		
		auto ball8 = make_shared<lambertian>(color(0, 0, 0));
		start = point3(0, 1, 0);
		end = point3(3, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball8));
		
		auto ball12 = make_shared<metal>(color(0.6, 0, 0.75), 0.5);
		start = point3(0, 1, 2);
		end = point3(6, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball12));
		
		
		
		
		
		
		auto ball1 = make_shared<lambertian>(color(1, 1, 0));
		start = point3(1.44, 1, -3);
		end = point3(9, 1, -7);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball1));
		
		auto ball3 = make_shared<lambertian>(color(1, 0, 0));
		start = point3(1.44, 1, -1);
		end = point3(10, 1, -3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball3));
		
		auto ball14 = make_shared<metal>(color(0, 1, 0), 0.5);
		start = point3(1.44, 1, 1);
		end = point3(7, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball14));
		
		auto ball9 = make_shared<metal>(color(1, 1, 0), 0.5);
		start = point3(1.44, 1, 3);
		end = point3(5, 1, 6);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball9));
		
		
		
		
		auto ball2 = make_shared<lambertian>(color(0, 0, 1));
		start = point3(2.88, 1, -4);
		end = point3(14, 1, -8);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball2));
		
		
		auto ball4 = make_shared<lambertian>(color(0.6, 0, 0.75));
		start = point3(2.88, 1, -2);
		end = point3(13, 1, -5);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball4));
		
		auto ball15 = make_shared<metal>(color(0.47, 0.25, 0.03), 0.5);
		start = point3(2.88, 1, 0);
		end = point3(15, 1, 2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball15));
		
		auto ball7 = make_shared<lambertian>(color(0.47, 0.25, 0.03));
		start = point3(2.88, 1, 2);
		end = point3(9, 1, 3);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball7));
		
		auto ball13 = make_shared<metal>(color(1, 0.25, 0.03), 0.5);
		start = point3(2.88, 1, 4);
		end = point3(7, 1, 9);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball13));
		
		auto ball_white = make_shared<dielectric>(1.5);
		start = point3(-3.88, 1, 0);
		end = point3(-4.5, 1, -2);
		world.add(make_shared<sphere>((start + (end - start) / frames * (i-initial)), 1.0, ball_white));
		
		
		cam.render(world, i);
		world.clear();
	}
    
}
