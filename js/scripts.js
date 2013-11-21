$(function(){
    function resize() {
        var div_height = $(".macrophoto__main-area-image").height();
        $(".preview-images__list").height(div_height);
    }
    alert(1);
    resize();
    window.onresize = function(event) {
        resize();
    }
});