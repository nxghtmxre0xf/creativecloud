const getDeleteTimer = () => {
    return Number($('.delete-button').attr('data-timer'));
}

const setDeleteTimer = (value) => {
    $('.delete-button').attr('data-timer', `${value}`);
}

let timer = null;

const dropDB = () => {
    $.get(`/api/db/drop`,
        (data, textStatus, jqXHR) => {
            window.location.reload();
        }
    );
}

const imagePreview = () => {
    const source = $('#image-preview').attr('src');

    const img = new Image();
    img.src = source;
    img.onload = () => {
        $('.image-preview-size').text(`${img.width}x${img.height}`);
    };
}

$(function () {
    $('.delete-button').prop('disabled', true);

    imagePreview();

    $('#logo-file').on('change', (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.onload = () => {
            $('#image-preview').attr('src', reader.result);
            imagePreview();
        }
        
        reader.readAsDataURL(file);
    });

    $('.delete-button').on('mouseenter', () => {
        $('.delete-button').attr('data-timer', getDeleteTimer() - 1);

        timer = setInterval(() => {
            if(getDeleteTimer() > 0) $('.delete-button').attr('data-timer', getDeleteTimer() - 1);
            else {
                $('.delete-button').prop('disabled', false);
                clearInterval(timer);
                timer = null;
            }
        }, 1000);
    });

    $('.delete-button').on('mouseleave', () => {
        setDeleteTimer(5);
        $('.delete-button').prop('disabled', true);

        clearInterval(timer);
        timer = null;
    });

    const deleteThread = (id) => {
    $.get(`/api/thread/delete/${id}`,
        (data, textStatus, jqXHR) => {
            window.location.href = data.redirect;
        }
    );
}
});