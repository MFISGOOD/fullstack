var $ = require('jquery');
$(function(){
  $(":button").on('click',addTodo);
  $(":text").on('keypress',function(e){
    var key = e.keyCode;
    if(key === 13 || key === 169){
      addTodo();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
  $('ul').on('change','li :checkbox',function(){
    var $this = $(this),
    $input = $this[0],
    $li = $this.parent(),
    id = $li.attr('id'),
    checked = $input.checked,
    data = {done: checked};
    updatedTodo(id,data,function(d){
      $li.toggleClass('checked');
    });
  });
  $('ul').on('keydown','li span',function(e){
    var $this = $(this),
        $span = $this[0],
        $li = $this.parent(),
        id = $li.attr('id'),
        key = e.keyCode,
        target = e.target,
        text = $span.innerHTML,
        data = {text:text};
        $this.addClass('editing');
        if(key === 27){//escape key
          resetTodo(id,function(todo){
            $span.innerHTML = todo.text;
          });
          $this.removeClass('editing');
          target.blur();
        }else if(key === 13){//enter key
          updatedTodo(id,data,function(d){
            $this.removeClass('editing');
            target.blur();
          });
          e.preventDefault();
        }
  });
  $('ul').on('click','li a',function(){
    var $this = $(this),
    $input = $this[0],
    $li = $this.parent(),
    id = $li.attr('id');
    deleteTodo(id,function(e){
      deleteTodoLi($li);
    });
  });
  initTodoObserver();//Call the Observer on DOM Ready
  $('.filter').on('click','.show-all',function(){
    $('.hide').removeClass('hide');
  });
  $('.filter').on('click','.show-not-done',function(){
    $('.hide').removeClass('hide');
    $('.checked').closest('li').addClass('hide');
  });
  $('.filter').on('click','.show-done',function(){
    $('li').addClass('hide');
    $('.checked').closest('li').removeClass('hide');
  });
  $('.clear').on('click',function(){
      var $doneLi = $('.checked').closest('li');
      for(var i = 0; i < $doneLi.length ; i++){
        var $li = $($doneLi[i]);
        var id = $li.attr('id');
        (function($li){
            deleteTodo(id, function(){
            deleteTodoLi($li);
          });
        }($li));
      }
  });
});
var todoInnerHtml = function(todo){
  return(
    `<li id="${todo._id}" class="list-group-item ${todo.done ? 'checked' : '' }">
        <input type="checkbox" ${todo.done ? 'checked' : ''}>
        <span contenteditable="true">${todo.text}</span>
        <a class="pull-right"><small><i class="glyphicon glyphicon-trash"></i></small></a>
    </li>`
  );
}
var addTodo = function(){
  var text = $('#add-todo-text').val();
  $.ajax({
    url : '/api/todos',
    type : 'POST',
    data : {
      text:text
    },
    dataType : 'json',
    success : function(data){
      var todo = data.todo;
      var newLiHtml  = todoInnerHtml(data.todo);
      $('form + ul').append(newLiHtml);
      $('#add-todo-text').val('');
    }
  });
};
var updatedTodo = function(id,data,cb){
  $.ajax({
    url : '/api/todos/'+id,
    type: 'PUT',
    data: data,
    dataType: 'json',
    success : function(data){
      cb();
    }
  });
};
var deleteTodo = function(id,cb){
  $.ajax({
    url : '/api/todos/'+id,
    type: 'DELETE',
    data: {
      id: id
    },
    dataType: 'json',
    success: function(data){
      cb();
    }
  });
};
var deleteTodoLi = function($li){
  $li.remove();
};
var resetTodo = function(id,cb){
  $.ajax({
    url : '/api/todos/'+id,
    type: 'GET',
    dataType: 'json',
    success : function(data){
      cb(data);
    }
  });
};
var initTodoObserver = function(){
  var target = $('ul')[0];
  var config = {attributes: true, childList: true, characterData: true};
  var observer = new MutationObserver(function(mutationRecords){
      $.each(mutationRecords,function(index,mutationRecord){
         updateTodoCount();
      });
  });
  if(target){
    observer.observe(target,config);
  }
  updateTodoCount();
};
var updateTodoCount = function(){
  $('.count').text($('li').length);
};
