import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
Dropzone.options.imagen = {
    dictDefaultMessage:'Sube tus imagenes aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize:50,
    maxFiles:1,
    parallelUploads:1,
    autoProcessQueue:false,
    addRemoveLinks:true,
    dictRemoveFile: 'Borrar Archivo',
    ddictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token':token
    },
    paramName:'imagen'
}