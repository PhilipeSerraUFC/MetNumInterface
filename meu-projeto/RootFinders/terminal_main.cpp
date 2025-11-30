#include "root_finders.cpp"
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <functional>
#include <cmath>
#include <iomanip>
#include <algorithm>

using namespace std;

/*
- fa retorna a função dada de acordo com o valor de 'a', dfa retorna a derivada de fa.
- os métodos com '2' no final são adaptações dos métodos originais, seja adicionando um critério de parada que não
tinha ou só tirando o bool responsável pelos prints
- os métodos com 'results' no fim do nome retornam o Results, mas são principalmente uma modificação dos métodos com '2' no fim
nos quais recebem um vetor nos argumentos e adiciona os resultados de cada iteração nesse vetor
- resultToString transforma Result em string
*/

vector<string> resultToVecString(Result x){
    vector<string> v;
    v.push_back(to_string(x.root));
    v.push_back(to_string(x.residual));
    v.push_back(to_string(x.error));
    v.push_back(x.converged ? "Sim" : "Não");
    v.push_back(to_string(x.interations));
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

        double a_barramento = a_foguetes[i] < 0 ? pow((double)3, a_foguetes[i]) : pow((double)2, a_foguetes[i]);
        double b_barramento = a_foguetes[i] < 0 ? pow((double)2, a_foguetes[i]) : pow((double)3, a_foguetes[i]);
        double x0 = pow((double)2.7, a_foguetes[i]);

        /*Um board tem o seguinte formato:
        vec_text vec_bissection vec_false_pos vec_new_raph
        | a_i           | bisecção      | posição falsa | Newton Raphson |
        | Dados Iniciais| [A, B]        | [A, B]        | x0 = value     |
        | x             |               |               |                |
        | f(x)          |               |               |                |
        | Erro          |               |               |                |
        | Num Inter     |               |               |                |
        */

        vector<vector<string>> comp_board = {};
        vector<string> vec_text = {"a = " + to_string(a_foguetes[i]), "Dados Iniciais", "x", "f(x)", "Erro", "Convergiu", "Numero de Interações"};
        vector<string> vec_bissection = {"Bissecção", "[" + to_string(a_barramento)+ "," + to_string(b_barramento) + "]"};
        vector<string> vec_false_pos = {"Posição Falsa", "[" + to_string(a_barramento) + "," + to_string(b_barramento) + "]"};
        vector<string> vec_new_raph = {"Newton Raphson", "x_0 = " + to_string(x0)};

        vector<string> bissection_result = resultToVecString(bisection(fa(a_foguetes[i]), a_barramento, b_barramento, error, max_iter, true));
        vector<string> false_pos_result = resultToVecString(false_position(fa(a_foguetes[i]), a_barramento, b_barramento, error, max_iter, true));
        vector<string> new_raph_result = resultToVecString(newton_raphson(fa(a_foguetes[i]), dfa(a_foguetes[i]), x0, error, max_iter));

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

void print_boards(const vector<vector<vector<string>>>& boards, ostream& output){
    for(int i = 0; i < boards.size(); i++){
        output << "\n========================================\n";
        output << "Quadro Comparativo " << (i+1) << "\n";
        output << "========================================\n\n";

        const vector<vector<string>>& board = boards[i];

        // Calcular largura máxima de cada coluna
        vector<size_t> col_widths(board.size(), 0);
        for(int col = 0; col < board.size(); col++){
            for(int row = 0; row < board[col].size(); row++){
                col_widths[col] = max(col_widths[col], board[col][row].length());
            }
        }

        // Imprimir linha superior
        output << "+";
        for(int col = 0; col < board.size(); col++){
            output << string(col_widths[col] + 2, '-') << "+";
        }
        output << "\n";

        // Imprimir em formato de tabela
        for(int row = 0; row < board[0].size(); row++){
            output << "|";
            for(int col = 0; col < board.size(); col++){
                output << " " << left << setw(col_widths[col]) << board[col][row] << " |";
            }
            output << "\n";

            // Linha separadora após o cabeçalho (primeira linha)
            if(row == 0){
                output << "+";
                for(int col = 0; col < board.size(); col++){
                    output << string(col_widths[col] + 2, '=') << "+";
                }
                output << "\n";
            }
        }

        // Imprimir linha inferior
        output << "+";
        for(int col = 0; col < board.size(); col++){
            output << string(col_widths[col] + 2, '-') << "+";
        }
        output << "\n";
    }
}

int main(){
    // Ler tamanho do vetor
    int n;
    cout << "Digite o tamanho do vetor a_foguetes: ";
    cin >> n;

    // Ler os valores de a_foguetes
    vector<double> a_foguetes(n);
    cout << "Digite os " << n << " valores de a_foguetes:\n";
    for(int i = 0; i < n; i++){
        cout << "a_foguetes[" << i << "]: ";
        cin >> a_foguetes[i];
    }

    // Ler erro máximo em notação científica (mantissa e expoente)
    int mantissa, expoente;
    cout << "Digite a mantissa do erro máximo (inteiro): ";
    cin >> mantissa;
    cout << "Digite o expoente do erro máximo (inteiro): ";
    cin >> expoente;
    double error = mantissa * pow(10.0, expoente);

    // Ler quantidade máxima de iterações
    int max_iter;
    cout << "Digite a quantidade máxima de iterações: ";
    cin >> max_iter;

    // Gerar os quadros comparativos
    vector<vector<vector<string>>> boards = quadro_comparativo(a_foguetes, error, max_iter);

    // Imprimir no terminal
    cout << "\n\n========================================\n";
    cout << "RESULTADOS\n";
    cout << "========================================\n";
    print_boards(boards, cout);

    // Salvar em arquivo
    ofstream arquivo("resultado.txt");
    if(arquivo.is_open()){
        arquivo << "Resultados da Análise de Métodos Numéricos\n";
        arquivo << "==========================================\n\n";
        arquivo << "Parâmetros utilizados:\n";
        arquivo << "- Erro máximo: " << mantissa << "e" << expoente << " = " << error << "\n";
        arquivo << "- Iterações máximas: " << max_iter << "\n";
        arquivo << "- Valores de a: ";
        for(int i = 0; i < a_foguetes.size(); i++){
            arquivo << a_foguetes[i];
            if(i < a_foguetes.size() - 1) arquivo << ", ";
        }
        arquivo << "\n\n";

        print_boards(boards, arquivo);

        arquivo.close();
        cout << "\n\nResultados salvos em 'resultado.txt'\n";
    } else {
        cerr << "Erro ao criar arquivo de saída!\n";
    }

    return 0;
}