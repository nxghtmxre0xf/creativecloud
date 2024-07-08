const convertFileToBlob = (e) => {
    const file = e.target.files[0];

    const sizeKB = Math.round(file.size / 1024);
    
    $('#image-size').text(sizeKB);

    if(sizeKB > 1024) {
        $('#image-data').val("Слишком большой файл!");
        console.log(sizeKB);
        console.log("Слишком большой файл!");

        setTimeout(() => {
            $('#image-data').val("");
            previewImage();
        }, 3000);

        previewImage();

        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        $('#image-data').val(reader.result);
        $('#image-preview').attr('src', reader.result);
        $('#thread-img-preview').attr('src', reader.result); 
    };
}

const previewImage = () => {
    const value = $('#image-data').val();

    $('#image-preview').attr('src', value);
    $('#thread-img-preview').attr('src', value);
    $('#image-size').text("0");

    document.getElementById('image-preview').onerror = () => {

        if(value == "") {
            $('#image-preview').attr('src', "../../media/ccloud/no-image.png"); 
            $('#thread-img-preview').attr('src', "../../media/ccloud/no-image.png"); 
            return;
        }

        $('#image-preview').attr('src', "../../media/ccloud/error-image.png");
        $('#thread-img-preview').attr('src', "../../media/ccloud/error-image.png");
    }
}

$(function () {
    previewImage();

    $('.ql-editor p:first').remove();

    $('#title').val($('#title-rely').html());
    $('#text').val($('#editor > div').html());

    $('#title-rely').on('input', () => {
        $('#title').val($('#title-rely').html());
    });

    $('#editor > div').on('input', () => {
        $('#text').val($('#editor > div').html());
    });
    
    setInterval(() => {
        $('#text').val($('#editor > div').html());
    }, 200);

    $('#thread-image').on('change', (e) => {
        convertFileToBlob(e);
    });

    $('#image-data').on('input', () => {
        previewImage();
    });

    setInterval(() => {
        $('#thread-block-preview').attr('data-title', $('#title-rely').html());
        $('#thread-title-preview').html($('#title-rely').html());
        $('#thread-category-preview').html($('#thread-category').val() || "Без категории");
    }, 100);
});