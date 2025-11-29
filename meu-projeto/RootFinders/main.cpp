#include "root_finders.cpp"
#include <iomanip>
#include <emscripten/bind.h>

using namespace std;

/*

- fa retorna a função dada de acordo com o valor de 'a', dfa retorna a derivada de fa.

- os métodos com '2' no final são adaptações dos métodos originais, seja adicionando um critério de parada que não
tinha ou só tirando o bool responsável pelos prints

- os métodos com 'results' no fim do nome retornam o Results, mas são principalmente uma modificação dos métodos com '2' no fim
nos quais recebem um vetor nos argumentos e adiciona os resultados de cada iteração nesse vetor

- resultToString transforma Result em string

*/

vector<string> resultToVecString (Result x){
    vector<string> v;
    v.push_back (to_string(x.root));
    v.push_back (to_string(x.residual));
    v.push_back (to_string(x.error));
    v.push_back (x.converged? "Sim" : "Não");
    v.push_back (to_string(x.interations)); 

    return v;
}

function<double(double)> fa(double a){
    return [a](double d){
        return a*d - d*log(d);
    };

}

function<double(double)> dfa(double a){
    return [a](double d){
        return a - log(d) - 1;
    };

}


vector<vector<vector<string>>> quadro_comparativo(vector<double> a_foguetes, double error, int max_iter){

    vector<vector<vector<string>>> boards;


    for(int i = 0; i < a_foguetes.size(); i++){

        /*A solução da equação ad - dln(d) é d = e^a, 
        seja [A,B] o barramento, então devemos ter A <= e^a e e^B >= e^b
        para que seja possível a convergencia
        
        
        Portanto, usaremos o barramento [2^a,3^a] se a > 0 e [3^a, 2^a] se a < 0
        
        No caso do Newton-Raphson, podemos utilizar o valor inicial de x0 = 2.7^a, ja que é proximo do valor de e^a
        
        */

        double a_barramento = a_foguetes[i] < 0 ?  pow((double)3, a_foguetes[i]) : pow((double)2, a_foguetes[i]);
        double b_barramento =  a_foguetes[i] < 0 ?  pow((double)2, a_foguetes[i]) : pow((double)3, a_foguetes[i]);
        double x0 = pow((double)2.7, a_foguetes[i]);


        /*Um board tem o seguinte formato:
            vec_text    vec_bissection  vec_false_pos  vec_new_raph
        | a_i           | bisecção   | posição falsa | Newton Raphson |
        | Dados Iniciais| [A, B]     | [A, B]        | x0 = value     |
        | x             |            |               |                |
        | f(x)          |            |               |                |
        | Erro          |            |               |                |
        | Num Inter     |            |               |                |
        
        */

        vector<vector<string>> comp_board = {};
        vector<string> vec_text = {"a = " + to_string(a_foguetes[i]),  "Dados Iniciais", "x", "f(x)", "Erro", "Convergiu", "Numero de Interações"};
        vector<string> vec_bissection = {"Bissecção", "[" + to_string(a_barramento)+ "," + to_string(b_barramento) + "]"};
        vector<string> vec_false_pos = {"Posição Falsa",  "[" + to_string(a_barramento) + "," + to_string(b_barramento) + "]"};
        vector<string> vec_new_raph = {"Newton Raphson", "x_0 = " + to_string(x0)};

        vector<string> bissection_result = resultToVecString(bisection(fa(a_foguetes[i]), a_barramento, b_barramento, error, max_iter, true));
        vector<string> false_pos_result = resultToVecString(false_position(fa(a_foguetes[i]), a_barramento, b_barramento, error, max_iter, true));
        vector<string> new_raph_result = resultToVecString(newton_raphson(fa(a_foguetes[i]), dfa(a_foguetes[i]), x0 , error, max_iter));

        vec_bissection.insert(vec_bissection.end(), bissection_result.begin(), bissection_result.end());
        vec_false_pos.insert(vec_false_pos.end(), false_pos_result.begin(), false_pos_result.end());
        vec_new_raph.insert(vec_new_raph.end(), new_raph_result.begin(), new_raph_result.end());

        comp_board.push_back(vec_text);
        comp_board.push_back(vec_bissection);
        comp_board.push_back(vec_false_pos);
        comp_board.push_back(vec_new_raph);

        boards.push_back(comp_board);
    }


    return boards;
}


EMSCRIPTEN_BINDINGS(metodos_numericos) {
    // registra vetores aninhados
    emscripten::register_vector<std::string>("VectorString");
    emscripten::register_vector<std::vector<std::string>>("VectorVectorString");
    emscripten::register_vector<std::vector<std::vector<std::string>>>("VectorVectorVectorString");

    emscripten::register_vector<double>("VectorDouble");

    emscripten::function("comparative_boards", &quadro_comparativo);
}


/*
int main(){
    vector<double> u = {1, 1.4, 8};
    vector<vector<vector<string>>> v = quadro_comparativo(u); 

    for(int i = 0; i < v.size(); i ++){
        vector<vector<string>> vi = v[i];
        for(int j = 0; j < vi.size(); j ++){
            vector<string> vij = vi[j];
            for(int k = 0; k < vij.size() ; k ++){
                //cout << i << j << k << endl;
                cout << v[i][j][k] << endl;
            }
        }
    }


    return 0;
}
*/