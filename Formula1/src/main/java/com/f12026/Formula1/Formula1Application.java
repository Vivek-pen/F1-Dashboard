package com.f12026.Formula1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class Formula1Application {

	public static void main(String[] args) {
		SpringApplication.run(Formula1Application.class, args);
	}

}
