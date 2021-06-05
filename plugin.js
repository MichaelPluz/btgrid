(function(){
  CKEDITOR.plugins.add('btgrid', {
      lang: 'en,ru,fr,nl,de',
      requires: 'widget,dialog',
      icons: 'btgrid',
      init: function(editor) {
       var maxGridColumns = 12;
       var lang = editor.lang.btgrid;

       CKEDITOR.dialog.add('btgrid',  this.path + 'dialogs/btgrid.js');

       editor.addContentsCss( this.path + 'styles/editor.css');
       // Add widget
       editor.ui.addButton('btgrid', {
         label: lang.createBtGrid,
         command: 'btgrid',
         icon: this.path + 'icons/btgrid.png'
       });
       editor.widgets.add('btgrid',
         {
           allowedContent: 'div(!btgrid);div(!row,!row-*);div(!col-*-*);div(!content)',
           requiredContent: 'div(btgrid)',
           parts: {
             btgrid: 'div.btgrid',
           },
           editables: {
             content: '',
           },
           template:
                   '<div class="btgrid">' +
                   '</div>',
           //button: lang.createBtGrid,
           dialog: 'btgrid',
           defaults: {
            //  colCount: 2,
            rowCount: 1
            // colScheme: [6, 6]
          },
          // Before init.
           upcast: function(element) {
             return element.name == 'div' && element.hasClass('btgrid');
           },
           // initialize
           // Init function is useful after copy paste rebuild.
           init: function() {
             var rowNumber= 1;
             var rowCount = this.element.getChildCount();
             for (rowNumber; rowNumber <= rowCount;rowNumber++) {
               this.createEditable(maxGridColumns, rowNumber);
             }
           },
           // Prepare data
           data: function() {
             if (this.data.colCount && this.element.getChildCount() < 1) {
               var colCount = this.data.colCount;
               var colScheme = this.data.colScheme;
               var rowCount = this.data.rowCount;
               var row = this.parts['btgrid'];
               for (var i= 1;i <= rowCount;i++) {
                 this.createGrid(colCount, row, i, colScheme);
               }
             }
           },
           //Helper functions.
           // Create grid
           createGrid: function(colCount, row, rowNumber, colScheme) {
             var content = '<div class="row row-' + rowNumber + '">';
             for (var i = 1; i <= colCount; i++) {
               content = content + '<div class="col col-md-' + colScheme[i-1] + '">' +
                                   '  <div class="content">' +
                                   '    <p>Col ' + i + ' content area</p>' +
                                   '  </div>' +
                                   '</div>';
             }
             content =content + '</div>';
             row.appendHtml(content);
             this.createEditable(colCount, rowNumber);
           },
           // Create editable.
           createEditable: function(colCount,rowNumber) {
             for (var i = 1; i <= colCount; i++) {
               this.initEditable( 'content'+ rowNumber + i, {
                  selector: '.row-'+ rowNumber +' > div:nth-child('+ i +') div.content'
                } );
              }
            }
          }
        );
      }
    }
  );

})();
