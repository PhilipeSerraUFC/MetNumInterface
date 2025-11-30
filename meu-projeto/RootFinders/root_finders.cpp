#include "root_finders.hpp"
#include <cmath>
#include <stdexcept>
#include <iostream>

// Métodos de Horner para cálculo de polinômios e suas derivadas

double eval_polynomial(const std::vector<double>& coeffs, double x);

double eval_derivative_polynomial(const std::vector<double>& coeffs, double x);

Result bisection(const std::function<double(double)>& f, double a, double b, double epsilon, int max_inter, bool verbose){
    double x;
    // Checagem se o intervalo fornecido é válido
    if(f(a) * f(b) >= 0){
        throw std::invalid_argument("Intervalo inválido: f(a) e f(b) possuem o mesmo sinal!");
    }
    // Imprimir quantidade mínima de interações estimada
    if(verbose){
        int min_inter = std::ceil((std::log10(b-a) - std::log10(epsilon))/std::log10(2));
        std::cout << "Dado o intervalo I = [" << a << "," << b << "], precisão e = " << epsilon << ", o método irá convergir depois de " << min_inter << " passos de iteração.\n";  
    } 
    for(int k = 1; k <= max_inter; k++){
        x = 0.5 * (a+b);
        if(verbose){
            std::cout << "========== Iteração " << k << " ==========\n";
            std::cout << "I = [" << a << ", " << b << "]\n";
            std::cout << "f(a) = " << f(a) << "\n";
            std::cout << "f(b) = " << f(b) << "\n";
            std::cout << "x = " << x << "\n";
            std::cout << "f(x) = " << f(x) << "\n\n";
        }
        if((b - a) < epsilon){
            return {x, k, true, std::abs(f(x)), std::abs(b-a)};
        }
        // Escolha dos extremos do intervalo da próxima interação
        if(f(x) * f(a) > 0){
            // se f(x) e f(a) possuem o mesmo sinal
            a = x;
            
        }else{
            b = x;
        }
    }
    return {x, max_inter, false, std::abs(f(x)), std::abs(b-a)};
}

Result false_position(const std::function<double(double)>& f, double a, double b, double epsilon, int max_inter, bool verbose){
    double x;
    double x0 = a;
    // Checagem se o intervalo fornecido é válido
    if(f(a) * f(b) >= 0){
        throw std::invalid_argument("Intervalo inválido: f(a) e f(b) possuem o mesmo sinal!");
    }
    for(int k = 1; k <= max_inter; k++){
        x = (a*f(b) - b*f(a))/(f(b) - f(a));
        if(verbose){
            std::cout << "========== Iteração " << k << " ==========\n";
            std::cout << "I = [" << a << ", " << b << "]\n";
            std::cout << "f(a) = " << f(a) << "\n";
            std::cout << "f(b) = " << f(b) << "\n";
            std::cout << "x = " << x << "\n";
            std::cout << "f(x) = " << f(x) << "\n\n";
        }

        if(std::abs(b - a) < epsilon){
            return {x, k, true, std::abs(f(x)), std::abs(b-a)};
        }

        // Escolha dos extremos do intervalo da próxima interação
        if(f(x) * f(a) > 0){
            // se f(x) e f(a) possuem o mesmo sinal
            a = x;
        }else{
            b = x;
        }

        //Criterio de parada baseado na diferença entre o resultado anterior e o resultado atual

        if(std::abs(x-x0) < epsilon){
            return {x, k, true, std::abs(f(x)), std::abs(x-x0)};
        }
        //Mas ele não é justo, o valor real pode estar fora deste intervalo de erro.... pode?

        x0 = x;
        
    }
    return {x, max_inter, false, std::abs(f(x)), std::abs(b-a)};
}

Result fixed_point(const std::function<double(double)>& phi, double x0, double epsilon, int max_inter, bool verbose){
    double x1;
    for(int k = 0; k <= max_inter; k++){
        x1 = phi(x0);
        if(verbose){
            std::cout << "========== Iteração " << k << " ==========\n";
            std::cout << "x = " << x0 << "\n";
            std::cout << "phi(x) = " << x1 << "\n\n";  
        }
        // Verificação do critério de parada |xk - xk-1| < epsilon 
        if(std::abs(x1 - x0) < epsilon){
            return {x1, k, true, -1};
        }
        x0 = x1;
    }
    return {x1, max_inter, false, -1};
}

Result newton_raphson(const std::function<double(double)>& f, const std::function<double(double)>& df, double x0, double epsilon, int max_inter, bool verbose){
    double x;
    for(int k = 1; k <= max_inter; k++){
        x = x0 - f(x0)/df(x0); // xk = xk-1 - f(xk-1)/f'(xk-1)
        if(verbose){
            std::cout << "========== Iteração " << k << " ==========\n";
            std::cout << "x = " << x << "\n";
            std::cout << "f(x) = " << f(x) << "\n";
            std::cout << "f'(x) = " << df(x) << "\n\n";           
        }
        // Verificação do critério de parada |xk - xk-1| < epsilon 
        if(std::abs(x - x0) < epsilon){
            return {x, k, true, std::abs(f(x)), std::abs(x - x0)};
        }
        x0 = x;
    }
    return {x, max_inter, false, std::abs(f(x)), std::abs(x-x0)};
}

Result secant(const std::function<double(double)>& f, double x0, double x1, double epsilon, int max_inter, bool verbose){
    double aux;
    for(int k = 0; k <= max_inter; k++){
        // Checagem se f(x1) e f(x0) são iguais na interação k -> Evitar divisão por zero!
        if((f(x1) - f(x0)) == 0){
            std::cout << "Etapa de refinamento interrompida! Valores f(xk) e f(xk-1) muito próximos, possível ocorrência de divisão por zero!\n";
            return {x1, k, true, std::abs(f(x1)), std::abs(x1-x0)};
        }
        if(verbose){
            std::cout << "========== Iteração " << k << " ==========\n";
            std::cout << "x0 = " << x0 << "\n";
            std::cout << "x1 = " << x1 << "\n";
            std::cout << "f(x0) = " << f(x0) << "\n";
            std::cout << "f(x1) = " << f(x1) << "\n\n";
        }
        // Verificação do critério de parada |xk - xk-1| < epsilon 
        if(std::abs(x1 - x0) < epsilon){
            return {x1, k, true, std::abs(f(x1)), std::abs(x1-x0)};
        }
        aux = (x0 * f(x1) - x1*f(x0))/(f(x1) - f(x0));
        x0 = x1;
        x1 = aux;
    }
    return {x1, max_inter, false, std::abs(f(x1))};
}

Result polynomial_newton_raphson(const std::vector<double>& coeffs, double x0, double epsilon, int max_inter, bool verbose){
    double x;
    for(int k = 0; k <= max_inter; k++){
        x = x0 - eval_polynomial(coeffs, x0)/eval_derivative_polynomial(coeffs, x0); // xk = xk-1 - p(xk-1)/p'(xk-1)
        if(verbose){
            std::cout << "========== Iteração " << k << " ==========\n";
            std::cout << "x = " << x << "\n";
            std::cout << "p(x) = " << eval_polynomial(coeffs, x) << "\n";
            std::cout << "p'(x) = " << eval_derivative_polynomial(coeffs, x) << "\n\n";
        }
        // Verificação do critério de parada |xk - xk-1| < epsilon 
        if(std::abs(x - x0) < epsilon){
            return {x, k, true, std::abs(eval_polynomial(coeffs, x)), std::abs(x-x0)};
        }
        x0 = x;
    }
    return {x, max_inter, false, std::abs(eval_polynomial(coeffs, x)), std::abs(x-x0)};
}

double eval_polynomial(const std::vector<double>& coeffs, double x){
    double y = 0;
    for(double c: coeffs){
        y = c + y*x;
    }
    return y;
}

double eval_derivative_polynomial(const std::vector<double>& coeffs, double x){
    std::vector<double> dif_coeffs;
    for(int n = coeffs.size()-1, i = 0; i < coeffs.size()-1; n--, i++){
        dif_coeffs.push_back(coeffs[i]*n);
    }
    return eval_polynomial(dif_coeffs, x);
} 