$(document).ready(function() {
  var items = [];
  var itemsRaw = [];
  var id;

  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push(
        '<li class="bookItem" id="' +
          i +
          '">' +
          val.title +
          ' - ' +
          val.commentcount +
          ' comments</li>'
      );
      return i !== 14;
    });
    if (items.length >= 15) {
      items.push('<p>...and ' + (data.length - 15) + ' more!</p>');
    }
    $('<ul/>', {
      class: 'listWrapper',
      html: items.join(''),
    }).appendTo('#display');
  });

  var comments = [];
  $('#display').on('click', 'li.bookItem', function() {
    $('#detailTitle').html(
      '<b>' +
        itemsRaw[this.id].title +
        '</b> (id: ' +
        itemsRaw[this.id]._id +
        ')'
    );

    // setting the id for fixing some weird error
    id = itemsRaw[this.id]._id;
    console.log('id set', id);

    $.getJSON('/api/books/' + id, function(data) {
      comments = [];
      console.log(data[0].comments);
      $.each(data[0].comments, function(i, val) {
        comments.push('<li>' + val + '</li>');
      });
      console.log('comments', comments);
      comments.push(
        '<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>'
      );
      comments.push(
        '<br><button class="btn btn-info addComment" id="' +
          data._id +
          '">Add Comment</button>'
      );
      comments.push(
        '<button class="btn btn-danger deleteBook" id="' +
          data._id +
          '">Delete Book</button>'
      );

      $('#detailComments').html(comments.join(''));
    });
  });

  $('#bookDetail').on('click', 'button.deleteBook', function() {
    $.ajax({
      url: '/api/books/' + id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html(
          '<p style="color: red;">' + data + '<p><p>Refresh the page</p>'
        );
      },
    });
  });

  $('#bookDetail').on('click', 'button.addComment', function() {
    var newComment = `<li>${$('#commentToAdd').val()}</li>`;
    $.ajax({
      url: '/api/books/' + id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      },
    });
  });

  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      },
    });
  });

  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      },
    });
  });
});
