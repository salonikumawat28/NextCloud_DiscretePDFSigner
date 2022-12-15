function createSigningUrlHashParams(fileinfo, context) {
	let params = {};

	// Set nextcloud flow to be true
	params.externalSource = "NextCloud";

	// Create download URL.
	const downloadUrl = context.fileList.getDownloadUrl(fileinfo.fullName, fileinfo.dir, fileinfo.isDir)
	params.downloadUrl = window.location.origin + downloadUrl;

	// Create upload URL.
	// Note: As the upload URL will be signed, we have appended '-signed' in the filename.
	const signedFileName = `${fileinfo.name}-signed.${fileinfo.type}`;
	params.uploadUrl = `${window.location.origin}/remote.php/webdav${fileinfo.dir}/${signedFileName}`;

	return params;
}

/**
 * Extracts file information.
 * @param {string} fullFileName File name
 * @param {*} context Context of the file which needs to be signed
 * @returns file information
 */
function extractFileinfo(fullFileName, context) {
	let fileinfo = {};

	// Stores info whetherfile is a directory
	fileinfo.isDir = context.$file.attr('data-type') === 'dir';

	// Strores the directory of the file.
	fileinfo.dir = context.dir || context.fileList.getCurrentDirectory();

	// Stores file name and type.
	// Note: Finds the last occurance of '.' and splits on it to find the file name and type.
	const lastIndex = fullFileName.lastIndexOf('.');
	if (lastIndex !== -1) {
		fileinfo.name = fullFileName.slice(0, lastIndex);
		fileinfo.type = fullFileName.slice(lastIndex + 1);
	}
	fileinfo.fullName = fullFileName;
	
	return fileinfo;
}

function signPdfActionHandler(filename, context) {
	// Extract file information
	const fileinfo = extractFileinfo(filename, context);

	// Skip PDF signing for directories.
	if (fileinfo.isDir) {
		console.log("Skipping sign PDF action for directories.");
		return;
	}

	// Skip PDF signing for non-PDFs
	if (fileinfo.type.toLowerCase() !== 'pdf') {
		console.log("Skipping sign PDF action as file is not PDF.");
		return;
	}

	// Create sign url hash params.
	const hashParams = createSigningUrlHashParams(fileinfo, context);

	// Create hash from params
	const externalSourceHash = 'externalsource=' + hashParams.externalSource;
	const downloadUrlHash = 'downloadurl=' + hashParams.downloadUrl;
	const uploadUrlHash = 'uploadurl=' + hashParams.uploadUrl;


	// Create sign URL and open it in window.
	const signUrl = 'https://www-dev.privasphere.com/pdfjs-2_4_456-es5-dist/web/index.html';
	var signUrlFull = `${signUrl}#${uploadUrlHash}&${downloadUrlHash}&${externalSourceHash}`;
	console.log("Opening sign URL:" + signUrlFull);
	window.open(signUrlFull, '_blank');
}

function registerSignPdfAction() {

	OCA.DiscretePdfSigner = _.extend({}, OCA.DiscretePdfSigner)
	if (!OCA.DiscretePdfSigner) {
		OCA.DiscretePdfSigner = {}
	}

	OCA.DiscretePdfSigner.FilesPlugin = {
		attach: function(fileList) {
			fileList.fileActions.registerAction({
				name: 'SignPdf',
				displayName: t('files', 'Sign Pdf'),
				mime: 'application/pdf',
				order: 1500,
				permissions: OC.PERMISSION_UPDATE,
				iconClass: 'icon-rename',
				actionHandler: function (filename, context) {
					signPdfActionHandler(filename, context);
				}
			})
		},
	};
}

registerSignPdfAction();
OC.Plugins.register('OCA.Files.FileList', OCA.DiscretePdfSigner.FilesPlugin);
