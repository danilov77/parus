function btnProccess2(form,press) {
    var btnPrimary = form.find('.btn-primary' );
    var staticHeart = form.find('.staticHeart' );
    var dynamicHeart = form.find('.dynamicHeart' );
    if(press) {
        btnPrimary.attr("disabled", true);
        staticHeart.css("display","none");
        dynamicHeart.css("display","");
    } else {
        btnPrimary.attr("disabled", false);
        dynamicHeart.css("display","none");
        staticHeart.css("display","");
    }
}

$(document).ready(function(){
    $('#code_form'). on('submit', function(evt){
        evt. preventDefault();
        var form =  $(this);
        var action = form.attr('action' );

        btnProccess2( form,true);

        var $container = form.find('.alert' );
        $. ajax({
            url: action,
            type: 'POST' ,
            data: $(this). serialize(),
            success: function(data){
                btnProccess2( form,false);
                if(data.success){

                    alert('готово');
                } else {
//                    $container.html('Возникла проблема.' );
                    alert('ошибка');
                }
            },
            error: function(){
//                $container.html('Error.' );
                btnProccess2( form,false);
                alert('совсем ошибка');
            }
        });

    });
});

function change(idName) {
    if(document.getElementById(idName).style.display == 'none') {
        document.getElementById(idName).style.display = '';
    } else {
        document.getElementById(idName).style.display = 'none';
    }
    return false;
}

