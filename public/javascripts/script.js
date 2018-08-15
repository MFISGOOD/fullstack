document.addEventListener('DOMContentLoaded',function(event){
  var checkboxes = document.getElementsByTagName('input');
  for(var i = 0;i<checkboxes.length;i++){
    checkboxes[i].addEventListener('click',clickHndler);
  }
});

function clickHndler(){
  if(this.checked){
    this.parentNode.className = 'checked';
  }else{
    this.parentNode.className = '';
  }
}
