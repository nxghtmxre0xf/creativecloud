const setFavorite = (id, value) => {
    $.get("/api/thread/favorite", {id: id, value: value},
        (data, textStatus, jqXHR) => {
            if(data !== "true") alert("Ошибка");
            else window.location.reload();
        }
    );
}

const deleteThread = (id) => {
    $.get(`/api/thread/delete/${id}`,
        (data, textStatus, jqXHR) => {
            window.location.href = data.redirect;
        }
    );
}

const getDeleteTimer = () => {
    return Number($('.delete-button').attr('data-timer'));
}

const setDeleteTimer = (value) => {
    $('.delete-button').attr('data-timer', `${value}`);
}

let timer = null;

$(function () {
    $('.delete-button').prop('disabled', true);

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
});