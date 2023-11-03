function updateImagePreview(input) {
  const imagePreview = document.getElementById("imagePreview");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

document.getElementById("imagem").addEventListener("click", function() {
  // Abrir o diálogo de seleção de arquivo quando a imagem for clicada
  this.value = null; // Isso permite que o mesmo arquivo seja selecionado novamente
});