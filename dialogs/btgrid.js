CKEDITOR.dialog.add('btgrid', function (editor) {
    var lang = editor.lang.btgrid;
    var commonLang = editor.lang.common;

    // Whole-positive-integer validator.
    function validatorNum(msg) {
        return function () {
            var value = this.getValue(),
                pass = !!(CKEDITOR.dialog.validate.integer()(value) && value > 0);

            if (!pass) {
                alert(msg); // jshint ignore:line
            }

            return pass;
        };
    }

    function validatorColScheme() {
        return function () {
            var arrValues = this.getIntegratedValue();

            var pass = true;
            var sum = 0;
            var hasAuto = false;

            for (var i = 0; i < arrValues.length; i++) {
                var val = arrValues[i].trim();
                if(val === 'auto')
                {
                    hasAuto = true;
                    continue;
                }
                val = parseInt(val);
                sum += val;
                if (!(Number.isInteger(val) && val > 0)) {
                    pass = false;
                    break;
                }

            }
            if (!pass) {
                alert(lang.defineColSchemeError); // jshint ignore:line
            }
            if (! (sum === 12 || (hasAuto && sum <= 12))) {
                alert(lang.defineColSchemeSumError); // jshint ignore:line
                pass = false;
            }

            return pass;
        };
    }

    function calcSchemeValues(colNum) {
        colNum = parseInt(colNum);
        var arrValues = [];
        var minValue = Math.floor(12 / colNum);
        var add = 12 % colNum;

        for (var i = 0; i < colNum; i++)
            arrValues.push(minValue + ((add-- <= 0) ? 0 : 1));

        return arrValues;
    }

    return {
        title: lang.editBtGrid,
        minWidth: 600,
        minHeight: 300,
        onShow: function () {
            // Detect if there's a selected table.
            var selection = editor.getSelection(),
                ranges = selection.getRanges();
            var command = this.getName();

            var rowsInput = this.getContentElement('info', 'rowCount'),
                colSchemeInput = this.getContentElement('info', 'colScheme'),
                colsInput = this.getContentElement('info', 'colCount');

            if (command == 'btgrid') {
                var grid = selection.getSelectedElement();
                // Enable or disable row and cols.
                if (grid) {
                    this.setupContent(grid);
                    rowsInput && rowsInput.disable();
                    colsInput && colsInput.disable();
                    colSchemeInput && colSchemeInput.disable();
                }
            }


        },
        contents: [
            {
                id: 'info',
                label: lang.infoTab,
                accessKey: 'I',
                elements: [
                    {
                        id: 'colCount',
                        type: 'select',
                        required: true,
                        label: lang.selNumCols,
                        items: [
                            ['1', 1],
                            ['2', 2],
                            ['3', 3],
                            ['4', 4],
                            ['5', 5],
                            ['6', 6],
                            ['7', 7],
                            ['8', 8],
                            ['9', 9],
                            ['10', 10],
                            ['11', 11],
                            ['12', 12],
                        ],
                        validate: validatorNum(lang.numColsError),
                        setup: function (widget) {
                            this.setValue(widget.data.colCount);
                        },
                        // When committing (saving) this field, set its value to the widget data.
                        commit: function (widget) {
                            widget.setData('colCount', this.getValue());
                        },
                        onChange: function (api) {
                            var colSchemeInput = this.getDialog().getContentElement('info', 'colScheme');
                            colSchemeInput.createFillInputs(this.getValue());
                        }


                    },
                    {
                        id: 'colScheme',
                        type: 'select',
                        required: true,
                        label: lang.defineColScheme,
                        items: [
                            ['1', 1],
                            ['2', 2],
                            ['3', 3],
                            ['4', 4],
                            ['5', 5],
                            ['6', 6],
                            ['7', 7],
                            ['8', 8],
                            ['9', 9],
                            ['10', 10],
                            ['11', 11],
                            ['12', 12],
                            ['auto', 'auto'],
                        ],
                        validate: validatorColScheme(),
                        setup: function (widget) {
                            if (widget.data.colScheme)
                                this.setValue(this.createFillInputs(widget.data.colScheme.length, widget.data.colScheme));
                        },
                        commit: function (widget) {
                            widget.setData('colScheme', this.getIntegratedValue());
                        },
                        onShow: function () {
                            var div = this.getElement();
                            div.hide();
                        },

                        clearInputs: function () {
                            var div = this.getElement();
                            var nodeList = div.find('select');
                            var pattern = nodeList.getItem(0);
                            pattern.hide();
                            for (var i = 1; i < nodeList.count(); i++) {
                                nodeList.getItem(i).remove();
                            }
                            return pattern;
                        },
                        createFillInputs: function (numCol, arrValues) {
                            var div = this.getElement();
                            var pattern = this.clearInputs();

                            if (typeof arrValues == 'undefined')
                                arrValues = calcSchemeValues(numCol);

                            for (var i = 0; i < arrValues.length; i++) {
                                var element = pattern.clone();
                                element.$.innerHTML = pattern.$.innerHTML;
                                element.setValue(arrValues[i]);
                                element.appendTo(pattern.getParent());
                                element.show();
                            }
                            if (arrValues.length > 0)
                                div.show();
                        },
                        getIntegratedValue: function () {
                            var arrValues = [];

                            var div = this.getElement();
                            var nodeList = div.find('select');
                            for (var i = 1; i < nodeList.count(); i++) {
                                arrValues.push(nodeList.getItem(i).getValue());
                            }
                            return arrValues;
                        },
                        onFocus: function (event) {
                            return false;
                        }
                    },
                    {
                        id: 'rowCount',
                        type: 'text',
                        width: '50px',
                        required: true,
                        label: lang.genNrRows,
                        validate: validatorNum(lang.numRowsError),
                        setup: function (widget) {
                            var val = widget.data.rowCount;
                            this.setValue(val);
                        },
                        commit: function (widget) {
                            widget.setData('rowCount', this.getValue());
                        },
                        onKeyUp: function (event) {
                            this.setValue(this.getValue().replace(/[^0-9]/ig, ''));
                        },
                        onFocus: function (event) {
                            event.sender.$.setSelectionRange(0, event.sender.$.value.length)
                        }

                    }
                ]
            }
        ],
    };
});
