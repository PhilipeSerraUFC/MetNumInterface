#ifndef ROOT_FINDERS_HPP
#define ROOT_FINDERS_HPP

#include <functional>
#include <vector>
#include <string>

// TAD que representa o retorno dos métodos implementados
struct Result {
    double root; // x onde f(x) é próximo de 0
    int interations; // Número de interações realizadas
    bool converged; // Se o método atingiu a precisão requirida no número de interações especificado
    double residual; // |f(root)|
    double error; 
};

// ==================== Métodos robustos ====================

// Método da bissecção
Result bisection(const std::function<double(double)>& f, double a, double b, double epsilon=1e-5, int max_inter=100, bool verbose=false);
/*
Método numérico baseado na ideia de realizar divisões sucessivas do intervalo [a, b] fornecido pela metade até satisfazer
o critério de convergência (b - a) < epsilon. OBS: Apenas o critério c1 foi considerado, o critério c2 (f(x) < epsilon) não.
    Args:
        (function) f: Função f(x) a qual desejamos computar a raíz
        (double) a, b: Extremos do intervalo I = [a, b]
        (double) epsilon: Valor de tolerância mínimo para a raíz computada (precisão)
        (int) max_inter: Quantidade máxima de interações
        (bool) verbose: Flag indicadora se o usuário deseja imprimir o valor da raíz para cada interação

    Returns: 
        (Result): Um struct contendo informações relevantes do cálculo da raíz
*/


// Método da posição falsa                 
Result false_position(const std::function<double(double)>& f, double a, double b, double epsilon=1e-5, int max_inter=100, bool verbose=false);
/*
Método numérico baseado no da bissecção, mas considerando os próprios valores do intervalo na função, fazendo assim uma ponderação da raiz com base
nos extremos dos intervalos mais próximo de zero.
    Args:
        (function) f: Função f(x) a qual desejamos computar a raíz
        (double) a, b: Extremos do intervalo I = [a, b]
        (double) epsilon: Valor de tolerância mínimo para a raíz computada (precisão)
        (int) max_inter: Quantidade máxima de interações
        (bool) verbose: Flag indicadora se o usuário deseja imprimir o valor da raíz para cada interação

    Returns: 
        (Result): Um struct contendo informações relevantes do cálculo da raíz
*/

// ==================== Métodos rápidos ====================

// Método do ponto fixo
Result fixed_point(const std::function<double(double)>& phi, double x0, double epsilon=1e-5, int max_inter=100, bool verbose=false);
/*
Método numérico (de convergência linear) onde dado uma função de interação phi que gere uma série convergente, temos a aproximação da raíz através da aproximação de um ponto fixo.
O método implementado considera que a função phi(x) satisfaz os critérios de convergência. 
    Args:
        (function) phi: Função de interação phi(x) a qual aproximos o ponto fixo.
        (double) x0: Aproximação inicial
        (double) epsilon: Valor de tolerância mínimo para a raíz computada (precisão)
        (int) max_inter: Quantidade máxima de interações
        (bool) verbose: Flag indicadora se o usuário deseja imprimir o valor da raíz para cada interação

    Returns: 
        (Result): Um struct contendo informações relevantes do cálculo da raíz
*/

// Método de Newton-Raphson                 
Result newton_raphson(const std::function<double(double)>& f, const std::function<double(double)>& df, double x0, double epsilon=1e-5, int max_inter=100, bool verbose=false);
/*
Método numérico (de convergência quadrática) baseado no ponto fixo, onde obtemos uma função de interação a partir de f'(x). O método implementado supõem que f(x), f'(x) e f''(x) são contínuas
no intervalo em que se deseja obter a raiz, e que f'(x) é diferente de zero nas iterações.
    Args:
        (function) f: Função f(x) a qual desejamos computar a raíz
        (function) df: Função f'(x), ou seja, a derivada da f(x)
        (double) x0: Aproximação inicial
        (double) epsilon: Valor de tolerância mínimo para a raíz computada (precisão)
        (int) max_inter: Quantidade máxima de interações
        (bool) verbose: Flag indicadora se o usuário deseja imprimir o valor da raíz para cada interação

    Returns: 
        (Result): Um struct contendo informações relevantes do cálculo da raíz
*/

// Método da Secante
Result secant(const std::function<double(double)>& f, double x0, double x1, double epsilon=1e-5, int max_inter=100, bool verbose=false);
/*
Método numérico (de convergência p = 1.618...) baseado no de Newton-Raphson, onde aproximamos o cálculo de f'(x) através de uma secante.
    Args:
        (function) f: Função f(x) a qual desejamos computar a raíz
        (double) x0, x1: Aproximações iniciais
        (double) epsilon: Valor de tolerância mínimo para a raíz computada (precisão)
        (int) max_inter: Quantidade máxima de interações
        (bool) verbose: Flag indicadora se o usuário deseja imprimir o valor da raíz para cada interação

    Returns: 
        (Result): Um struct contendo informações relevantes do cálculo da raíz
*/

// Método de Newton-Raphson adaptado para polinômios
Result polynomial_newton_raphson(const std::vector<double>& coeffs, double x0, double epsilon=1e-5, int max_inter=100, bool verbose=false);
/*
Método numérico baseado no de Newton-Raphson. A atenção se dá pelo fato da função ser garantidamente um polinômio, onde assim podemos aplicar
métodos específicos para o cálculo do polinômio avaliado para algum valor bem como para a sua derivada.
    Args:
        (vector<double>) coeffs: Coeficientes do polinômios a qual desejamos computar a raíz
        (double) x0: Aproximação inicial
        (double) epsilon: Valor de tolerância mínimo para a raíz computada (precisão)
        (int) max_inter: Quantidade máxima de interações
        (bool) verbose: Flag indicadora se o usuário deseja imprimir o valor da raíz para cada interação

    Returns: 
        (Result): Um struct contendo informações relevantes do cálculo da raíz
*/
#endif