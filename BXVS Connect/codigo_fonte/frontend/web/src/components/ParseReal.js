export default function parseReal(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}