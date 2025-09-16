from flask import render_template, url_for, request, redirect
from db import app
from controllers.ClienteController import ClienteController

@app.route("/")
def home(): 
    return render_template("home.html")

@app.route("/cadastro")
def cadastro(): 
    return render_template("cadastro.html")

@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    if request.method == "POST":
        nome = request.form["nome"]
        email = request.form["email"]
        senha = request.form["senha"]
        telefone = request.form["telefone"]
        sexo = request.form["sexo"]
        rg = request.form["rg"]
        cpf = request.form["cpf"]
        dataNascimento = request.form["dataNascimento"]
        estadoCivil = request.form["estadoCivil"]
        dataCadastro = request.form["dataCadastro"]
        if(nome and email and senha and telefone and sexo and rg and cpf and dataNascimento and estadoCivil and dataCadastro):
            ClienteController.cadastrar(nome, email, senha, telefone, sexo, rg, cpf, dataNascimento, estadoCivil, dataCadastro)
            return redirect("/")
        

if __name__ == "__main__": 
    app.run(debug=True)