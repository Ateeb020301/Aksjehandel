﻿$(function () {
    hentAlleKunder();
});

function hentAlleKunder() {
    $.get("aksje/hentAlle", function (aksjer) {
        formaterAksjer(aksjer);
    });
}

function formaterAksjer(aksjer) {
    let ut = "<table class='table table-striped'>" +
        "<tr>" +
        "<th>Navn</th><th>Pris</th><th>Stock</th><th></th><th></th>" +
        "</tr>";
    for (let aksje of aksjer) {
        ut += "<tr>" + 
            "<td>" + aksje.aksjenavn + "</td>" +
            "<td>" + aksje.pris + "</td>" +
            "<td>" + aksje.stock + "</td>" +
            "<td> <a class='btn btn-primary' href='endre.html?id=" + aksje.id+"'>Endre</a></td>"+
            "<td> <button class='btn btn-danger' onclick='slettKunde(" + aksje.id+")'>Slett</button></td>"+
            "</tr>";
    }
    ut += "</table>";
    $("#kundene").html(ut);
}

function slettKunde(id) {
    const url = "Kunde/Slett?id="+id;
    $.get(url, function (OK) {
        if (OK) {
            window.location.href = 'index.html';
        }
        else {
            $("#feil").html("Feil i db - prøv igjen senere");
        }

    });
};