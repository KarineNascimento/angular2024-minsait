import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduto } from 'src/app/interfaces/produto';
import { ProdutosService } from 'src/app/services/produtos.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cadastro-edicao',
  templateUrl: './cadastro-edicao.component.html',
  styleUrls: ['./cadastro-edicao.component.css']
})
export class CadastroEdicaoProdutosComponent {
  constructor(private produtosService: ProdutosService, private router: Router, private route: ActivatedRoute) {}

  produtoForm = new FormGroup({
    nomeProduto: new FormControl('',Validators.required),
    codigoBarras: new FormControl('',Validators.required),
    quantidade: new FormControl(0,Validators.required),
    preco: new FormControl(0,Validators.required),
  });

  id: number = 0;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      const idNumber = Number(id);
      if (idNumber) {
        this.id = idNumber;
        this.produtosService.buscarProdutoPorId(idNumber).subscribe(produto => {
          this.produtoForm.patchValue({
            nomeProduto: produto.nomeProduto,
            codigoBarras: produto.codigoBarras,
            quantidade: produto.quantidade,
            preco: produto.preco,
          })
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  cadastrarEditarProdutos() {
    const produto: IProduto = this.produtoForm.value as IProduto;

    if (this.id) {
      produto.id = this.id;
    }

    this.produtosService.cadastrarEditarProduto(produto).subscribe(
      (result) => {
        Swal.fire({
          title: "PARABÉNS",
          text: `Produto ${this.id ? 'editado': 'cadastrado'} com sucesso!`,
          icon: "success"
        });
        this.router.navigateByUrl('/produtos');
      },
      (erro) => {
        console.error(erro);
      }
    );
  }
}
