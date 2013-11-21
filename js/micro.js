$(function(){
  $( ".pin" ).draggable({ containment: ".macrophoto__main-area-image", handle: " > a" });
  var criterions = $('#criterion-list').find('.criterion-list__item'),
      pin_edit_block = pinEditBlockHTML(criterions),
      chosenCriterionsBlock = $('#criterion-list_chosen');
  $('#criterion-list').remove();

  $('.pins_overlay').on("click", ".pin > a", function(e){
    var $this = $(this).parent(),
      editBlock = $this.find('.pin__edit-block');
    if ($this.hasClass("pin_expanded")) {
      $this.removeClass("pin_expanded");
    } else {
      $this.addClass("pin_expanded");
      if (editBlock.css('left',0).offset().left < 5){
          editBlock.css({
            'left': -editBlock.offset().left+5
          });
      }
    }
    e.preventDefault();
  });
  chosenCriterionsBlock.on('click','.criterion-list__item', function (e) {
    var elem = $(this);
    elem.data('active-elem').data('active-elem', 0).find('.criterion-list__item').removeClass('criterion-list__item_active');
    elem.remove();
    e.preventDefault();
  });
  $('.pins_overlay').on('click','.criterion-list__item:not(.criterion-list__item_active)', function(e){
    var $this = $(this),
        list = $this.closest('.criterion-list'),
        activeElem;
    if (!list.data('active-elem')){
      activeElem = $this.clone().attr('title',"Удалить критерий").append('<span class="pin"><span>'+list.closest('.pin').find('>a').text()+'</span></span>').appendTo(chosenCriterionsBlock).data('active-elem',list);
      list.data('active-elem',activeElem);
    } else {
      activeElem = $this.clone().attr('title',"Удалить критерий").append('<span class="pin"><span>'+list.closest('.pin').find('>a').text()+'</span></span>').insertAfter(list.data('active-elem')).data('active-elem',list);
      list.data('active-elem').remove();
      list.data('active-elem',activeElem);
    }
    $this.closest('.criterion-list').find('.criterion-list__item_active').removeClass('criterion-list__item_active');
    $this.addClass('criterion-list__item_active');
  });

  $('body').on('click', '.pin__pagings__elem:not(.pin__pagings__elem_active) a', function(e){
    var $this = $(this),
        index = Number($this.attr('rel')),
        pagings = $this.closest('.pin__pagings').html(pagingsHTML({elemsCount:criterions.size(), active:index}));
    if (index==0){
      pagings.siblings('.pin__pagings-prev').addClass('pin__pagings-prev_disabled');
    } else {
      pagings.siblings('.pin__pagings-prev_disabled').removeClass('pin__pagings-prev_disabled');
    }
    if(index == criterions.size()-1){
      pagings.siblings('.pin__pagings-next').addClass('pin__pagings-next_disabled');
    } else {
      pagings.siblings('.pin__pagings-next_disabled').removeClass('pin__pagings-next_disabled');
    }
    $this.closest('.pin__edit-block').find('.criterions-list__tab').removeClass('criterions-list__tab_active').eq(index).addClass('criterions-list__tab_active');
    e.preventDefault();
  });
  $('body').on('click', '.pin__pagings-prev:not(.pin__pagings-prev_disabled)', function(e){
    var parent = $(this).siblings('.pin__pagings').find('.pin__pagings__elem_active').prev();
    parent.find('a').trigger('click');
    e.preventDefault();
  });
  $('body').on('click', '.pin__pagings-next:not(.pin__pagings-next_disabled)', function(e){
    var parent = $(this).siblings('.pin__pagings').find('.pin__pagings__elem_active').next();
    parent.find('a').trigger('click');
    e.preventDefault();
  });
  $('body').on("mousedown", ".pin > a", function(){
    $('body').data('mousedown_elem', this.parentNode);
  });
  $('body').on("mouseup", function(){
    var $this = $($(this).data('mousedown_elem')),
      editBlock = $this.find('.pin__edit-block');
    if ($this.size() && editBlock.is(':visible') && editBlock.css('left',0).offset().left < 5) {
        editBlock.css({
          'left': -editBlock.offset().left+5
        });
    }
    $(this).data('mousedown_elem', '')
  });
  $('body').on("click", ".pin__edit-block .close", function(e){
    var pin = $(this).closest('.pin');
    pin.find('.criterion-list').each(function(){
      if ($(this).data('active-elem')){
        $(this).data('active-elem').remove();
      }
    });
    pin.remove();
    e.preventDefault();
  });
 //  $('body').on("click", ".pin__edit-block .close", function(){
 //  // $( ".pin__edit-block .close" ).click(function(){
  
 //   $(this).siblings(".macro").hide();
 //   $(this).removeClass("close").addClass("close_disabled");
 //   $(this).html($(this).html()+"?");
 //   $(this).after("<a class='close_yes' href='#'>ДА</a><a class='close_no' href='#'>НЕТ</a>"); 
 // });

 //  $('body').on("click", ".pin__edit-block .close_no", function(){
 //        // $(this).animate({ marginTop:"-3.6em"}, 500);
 //        $(this).siblings(".macro").show();
 //        $(this).siblings(".close_disabled").addClass("close").removeClass("close_disabled");
 //        $(this).siblings(".close_yes").remove();
 //        $(this).remove();
 //      });

 //  $('body').on("click", ".pin__edit-block .close_yes", function(){
 //    var rel = $(this).parent().attr('rel');
 //    $(this).parent().siblings('.pin'+rel).remove();
 //    $(this).parent().remove();
 //  });


  $('.add_pin').click(function(){
      // var last_pin = 0;
      last_pin = $(this).parent().parent().find(".pins_overlay").children(".pin").last().children("a").html();
      if(typeof last_pin==="undefined") last_pin=0;
      last_pin++;
      var the_pin='<li class="pin pin'+last_pin+'"><a href="#">'+last_pin+'</a>'+pin_edit_block+'</li>';
      $(".pins_overlay").append(the_pin);
      $( ".pin" ).draggable({ containment: ".macrophoto__main-area-image", handle: " > a" });
    });

  // $(".macrophoto__main-area-image").each(function(){
  function censureAdd(target) {
     var this_index = target.index();
     target.prepend('<div class="svg_overlay" id="overlay'+this_index+'" style="position:absolute; z-index:9"></div>');
      // var id = $(this).attr("id");
      var this_div_id= $("#overlay"+this_index);
      var this_image=target.children().children().children(".macrophoto__main-area-image");
      this_div_id.width(this_image.width());
      this_div_id.height(this_image.height());
      var id = target.find(".svg_overlay").attr("id");
      var canvas = document.getElementById(id);
      editor = new VectorEditor(canvas, $(canvas).width(),$(canvas).height());
      editor.set("fill", "black");
      editor.set("fill-opacity", "1");
      editor.set("stroke-opacity","0");
      editor.setMode('rect');
      
      $(window).resize(function(){
        this_div_id.width(this_image.width());
        this_div_id.height(this_image.height());
        editor.draw.setSize(this_div_id.width(),this_div_id.height())
      })
  }



  $(".censure").click(function(){
    if($(this).hasClass("clicked")){
      $(this).siblings(".censure_save").remove();
    } else {
      $(this).addClass("clicked");
    censureAdd($(this).parent().parent());
    $(this).after("<a href='#' class='censure_save'><span class='iconic check'></span></a><a href='#' class='censure_dismiss'><span class='iconic x_alt'></span></a>");
    }
  });

  $('body').on('click', '.censure_dismiss', function(){
      $('.censure_dismiss').remove();
      $('.censure_save').remove();
      $('.svg_overlay').remove();
      $(".censure").removeClass('clicked');
  });

  $(".add_figure").click(function(){
    var figure = $(this).attr("rel");
    setFigure(figure);
  });
  $(".add_ruler").click(function(){
    lineTool();
  });

// $(this).after("<a href='#' class='censure_save'><span class='iconic check'></span></a><a href='#' class='censure_dismiss'><span class='iconic x_alt'></span></a>");


function pinEditBlockHTML(elems){
  return '<div class="pin__edit-block pin__edit-block_criterion">'+
                        '<ul class="criterion-list">'+
                          criterionsHTML(elems)+
                        '</ul>'+
                        '<ul class="pin__controls">'+
                            '<li class="pin__controls__item"><a href="#" class="close pin__control">Удалить метку</a></li>'+
                            '<li class="pin__controls__item">'+
                              (elems.size()>10 ? '<a class="pin__pagings-prev pin__pagings-prev_disabled">prev</a>'+'<ul class="pin__pagings">'+pagingsHTML({elemsCount:elems.size()})+'</ul>'+'<a class="pin__pagings-next">next</a>':"")+
                            '</li>'+
                        '</ul>'+
                    '</div>';
}
function criterionsHTML(elems){
  var html = "",
      leftUl = "<ul class='criterion-list__column'>",
      rightUl = leftUl,
      i;
  html+="<li class='criterions-list__tab criterions-list__tab_active'>";
  for (i=0; i<elems.size();i+=2){
    if(i>0 && i%10==0){
        html+=leftUl+"</ul>"+rightUl+"</ul></li><li class='criterions-list__tab'>";
        leftUl = rightUl = "<ul class='criterion-list__column'>";
    }
    leftUl+="<li class='"+elems.eq(i).attr('class')+"' data-criterion-index='"+elems.eq(i).attr('data-criterion-index')+"'>"+elems.eq(i).html()+"</li>";
    rightUl += elems.eq(i+1).size() ? "<li class='"+elems.eq(i+1).attr('class')+"' data-criterion-index='"+elems.eq(i+1).attr('data-criterion-index')+"'>"+elems.eq(i+1).html()+"</li>":"";
  }
  html+=leftUl+"</ul>"+rightUl+"</ul></li><li class='criterions-list__tab'>";
  return html;
}
function pagingsHTML(settings){
  var settings = $.extend({
        active: 0,
        elemsCount:100,
        perPage:10,
        elemClass: "pin__pagings__elem",
        elemActiveClass:"pin__pagings__elem_active",
        emptyElemHtml:"...",
        maxPagingsCount: 8,
        roundActiveCount: 3,
        emptyElemClass: "pin__pagings__elem_empty"
      },settings),
      pagings_count = Math.ceil(settings.elemsCount/settings.perPage),
      html = "",
      i;
  if (pagings_count > settings.maxPagingsCount) {
    if (settings.active > (settings.roundActiveCount-1)/2) {
      html += "<li class='"+settings.elemClass+"'><a rel='1'>1</a></li>\n"+
              "<li class='"+settings.elemClass+" "+settings.emptyElemClass+"'>"+settings.emptyElemHtml+"</li>\n";
      for (i = settings.active-(settings.roundActiveCount-1)/2; i < settings.active; i++) {
        html += "<li class='"+settings.elemClass+"'><a rel='"+i+"''>"+(i+1)+"</a></li>\n";
      }
      html += "<li class='"+settings.elemClass+" "+settings.elemActiveClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
    } else {
      for (i = 0; i < settings.active; i++) {
        html += "<li class='"+settings.elemClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
      }
      html += "<li class='"+settings.elemActiveClass+" "+settings.elemClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
    }
    if(pagings_count - settings.active -1 > (settings.roundActiveCount-1)/2) {
      for (i =settings.active+1; i <= settings.active+(settings.roundActiveCount-1)/2; i++){
        html += "<li class='"+settings.elemClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
      }
      html += "<li class='"+settings.elemClass+" "+settings.emptyElemClass+"'>"+settings.emptyElemHtml+"</li>\n"+
              "<li class='"+settings.elemClass+"'><a rel='"+(pagings_count-1)+"'>"+(pagings_count)+"</a></li>\n";
    } else {
      for (i = settings.active+1; i <= pagings_count-1; i++) {
        html += "<li class='"+settings.elemClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
      }
    }
  } else {
    for (i =0; i <= pagings_count-1; i++){
      if (i == settings.active){
        html += "<li class='"+settings.elemActiveClass+" "+settings.elemClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
      } else {
        html += "<li class='"+settings.elemClass+"'><a rel='"+i+"'>"+(i+1)+"</a></li>\n";
      }
    }
  }
  return html;
}
function drawMark(target) {
  target.prepend('<div class="svg_overlay" id="draw_mark" style="position:absolute; z-index:9"></div>');
  var canvas = document.getElementById("draw_mark");
  
  $("#draw_mark").width($(".macrophoto__main-area-image").width());
  $("#draw_mark").height($(".macrophoto__main-area-image").height());
  editor = new VectorEditor(canvas, $(canvas).width(),$(canvas).height());

      $(window).resize(function(){
        $("#draw_mark").width($(".macrophoto__main-area-image").width());
  $("#draw_mark").height($(".macrophoto__main-area-image").height());
        editor.draw.setSize($(".macrophoto__main-area-image").width(),$(".macrophoto__main-area-image").height())
      })
}
if($("#draw_mark").length<1) drawMark($("section.patient-card__content-block"));

  $(".add_ellipse").click(function(){
  setFigure('ellipse');
});
$(".add_rectangle").click(function(){
  setFigure('rect');
});
$(".add_polygon").click(function(){
  setFigure('polygon');
});
$(".add_ruler").click(function(){
  lineTool();
});


 $("body").on("mouseup", ".svg_overlay", function(){
       if(editor.mode != "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  }); 

 $("body").on("dblclick", ".svg_overlay", function(){
    if(editor.mode = "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  });


  function setFigure(mode){
    editor.setMode(mode=='selectp'?'select+':mode);
  }

  function lineTool() {
    mode="line";
    editor.setMode(mode=='selectp'?'select+':mode);    
  }

  function setModeDelete() {
    mode="delete";
    editor.setMode(mode=='selectp'?'select+':mode);    
  }

  $("#canvas").on("mouseup", function(){
    if(editor.mode != "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  });

  $("#canvas").on("dblclick", function(){
    if(editor.mode = "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  });


});

$(function(){
  function resize() {
    var div_height = $(".macrophoto__main-area-image").height();
    if($(".macrophoto__side-macrophoto").length>0) div_height -= $(".macrophoto__side-macrophoto").outerHeight(true)+28;
    $(".macrophoto__side-area ul").height(div_height);
    $(".pins_overlay").height(div_height);
  }
  resize();
  window.onresize = function(event) {
    resize();
  }
});



