'use strict';

console.log("loaded");




var finance = {

    balance: 0,
    income: 0,
    expense: 0,
    addedEntries: [],
    recountBalance: function() {

        var self = finance;

        setTimeout(function() {

            self.balance = 0;

            self.income = 0;

            self.expense = 0;

            self.addedEntries.forEach(function(entryElement) {

                self.balance += parseInt(entryElement.amount);
                entryElement.amount < 0 ? self.expense += entryElement.amount : self.income += entryElement.amount;

            });

            var balanceSum = document.getElementById("balanceSum");
            var incomeSum = document.getElementById("incomeSum");
            var expenseSum = document.getElementById("expenseSum");

            balanceSum.innerHTML = self.balance + " CZK";
            incomeSum.innerHTML = "Income: " + self.income + " CZK";
            expenseSum.innerHTML = "Spendings: " + self.expense + " CZK";

            localStorage.remember = JSON.stringify(self.addedEntries);


        }, 0); //timeout to make sure that other entries executed before the function
    },

    financeObject: function(date, amount, descrip, exType, originalName, callback) {


        this.date = date;
        this.amount = parseInt(amount);
        this.descrip = descrip;
        this.exType = exType;
        this.originalName = originalName;

        if (exType != "income") {

            this.amount = -amount;

        }

        callback();


    },

    sessionRestore: (function() {

        setTimeout(function() {


            if (localStorage.remember) {

                var restoredObj = JSON.parse(localStorage.remember);

                finance.addedEntries = restoredObj;

            }

            finance.addedEntries.forEach(function(element) {

                var ul = document.getElementById("allEntries");

                var newLi = document.createElement("LI");

                var newExpWrap = document.createElement("DIV");

                var newEntryF = document.createElement("DIV");

                var newEntryFP = document.createElement("P");

                var newEntryFH2 = document.createElement("H2");

                var newEntryS = document.createElement("DIV");

                var newEntrySH3 = document.createElement("H3");

                var newEntryT = document.createElement("DIV");

                var newEntryTImg = document.createElement("DIV");

                var exType = element.exType;

                newEntryF.classList.add("entryFirst");

                newEntryFP.classList.add("date");

                newEntryFH2.classList.add("spendingLog");

                newEntryS.classList.add("entrySecond");

                newEntrySH3.classList.add("expenseExplanation");

                newEntryT.classList.add("entryThird");

                newEntryTImg.classList.add("removeEntry");

                newExpWrap.classList.add("expenseWrap");

                newEntryF.appendChild(newEntryFP);
                newEntryF.appendChild(newEntryFH2);
                newExpWrap.appendChild(newEntryF);
                newEntryS.appendChild(newEntrySH3);
                newExpWrap.appendChild(newEntryS);
                newEntryT.appendChild(newEntryTImg);
                newExpWrap.appendChild(newEntryT);
                newLi.appendChild(newExpWrap);
                ul.appendChild(newLi);

                newEntrySH3.innerText = element.descrip;
                newEntryFP.innerText = element.date;
                newEntryFH2.innerText = parseInt(element.amount) + " CZK";



                if (exType == "income" || exType == "expense") { //assign the color to expense/income

                    exType == "income" ? newEntryFH2.classList.add("income") : newEntryFH2.classList.add("expense");

                }

            });

            var forCounter = 0;

            var trashCans = document.getElementsByClassName("removeEntry");

            for (forCounter = 0; forCounter < trashCans.length; forCounter++) {

                trashCans[forCounter].addEventListener("click", buttonControls.removeEntry);

            }

            finance.recountBalance(); //calculates the balance again after changes made

        }, 0);



    }())

};


var buttonControls = {

    wrapper: document.getElementById("Wrapper"),
    buttons: document.getElementsByClassName("footerBtn"),
    closeIt: document.getElementById("closePopUp"),
    exType: undefined,
    submitBtn: document.getElementById("submitEntry"),
    forms: document.getElementsByClassName("forms"), //input fields in the pop-up


    assignEvent: function() {

        this.closeIt.addEventListener("click", this.addEntry);
        this.submitBtn.addEventListener("click", this.submitEntry); //DOM creation'

        var i;

        for (i = 0; i < this.forms.length; i++) {

            this.forms[i].addEventListener("input", this.validateForm)
        }

        for (i = 0; i < this.buttons.length; i++) {

            this.buttons[i].addEventListener("click", this.addEntry);
        }
    },

    addEntry: function(e) {

        //takes actions if event fired on one of the buttons then takes actions depending on which
        if (e.target.id == "addIncome" || e.target.id == "addExpense" || e.target.id == "closePopUp" || e.target.parentNode.id == "closePopUp") {

            document.getElementById("popUp").classList.add("popUpActive"); //brings the pop-up to be visible
            buttonControls.wrapper.classList.contains("WrapWhenPop") ? {} : buttonControls.wrapper.classList.add("WrapWhenPop"); //applies blur to wrapper

            if (e.target.id == "addIncome") {

                document.getElementById("popUpTitle").innerHTML = "NEW INCOME ENTRY";
                buttonControls.exType = "income";

            } else if (e.target.id == "addExpense") {

                document.getElementById("popUpTitle").innerHTML = "NEW EXPENSE ENTRY";
                buttonControls.exType = "expense";

            } else if (e.target.id == "closePopUp" || e.target.parentNode.id == "closePopUp") {

                buttonControls.wrapper.classList.remove("WrapWhenPop");
                document.getElementById("popUp").classList.remove("popUpActive");

            }

        }

    },

    removeEntry: function(e) {

        var liParent = e.target.parentElement;

        while (liParent.className != "expenseWrap") {

            liParent = liParent.parentElement;

        }

        var deleteDate = liParent.childNodes[0].childNodes[0].innerHTML;
        var deleteAmount = parseInt(liParent.childNodes[0].childNodes[1].innerHTML);
        var deleteDesc = liParent.childNodes[1].childNodes[0].innerHTML;

        while (liParent.tagName != "LI" && liParent.tagName != "BODY") { //loops till finds parent element with LI tag or BODY
            //Body added to avoid infinite loops

            liParent = liParent.parentElement;

        }

        if (liParent.parentElement.tagName == "UL") {

            liParent.parentElement.removeChild(liParent);

        } else if (liParent.parentElement.tagName == "BODY") {

            throw "Unable to locate a parent element to be removed"; //throws an error if loops back to BODY
        }

        finance.addedEntries.forEach(function(element) {

            if (element.descrip == deleteDesc && (element.amount == deleteAmount || element.amount == -deleteAmount) && element.date == deleteDate) {

                var idx = finance.addedEntries.indexOf(element);
                finance.addedEntries.splice(idx, 1);
            }

        });

        finance.recountBalance(); //calculates the balance again after changes made
    },

    validateForm: function() {

        var i;

        var self = buttonControls;

        var regExpDate = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

        var regExpSum = /\D/;

        for (i = 0; i < self.forms.length; i++) {

            if (self.forms[i].value.trim() == "" || (isNaN(parseInt(self.forms[0].value)) || isNaN(parseInt(self.forms[1].value)))) {

                return false;

            } else if (regExpDate.test(self.forms[0].value) && !regExpSum.test(self.forms[1].value)) { //regExp tests

                return true;

            } else {

                return false;

            }

        }

    },

    submitEntry: function() {

        if (!buttonControls.validateForm()) {

            return;
        }

        //creates and appends all the DOM for the new entry

        var ul = document.getElementById("allEntries");

        var newLi = document.createElement("LI");

        var newExpWrap = document.createElement("DIV");

        var newEntryF = document.createElement("DIV");

        var newEntryFP = document.createElement("P");

        var newEntryFH2 = document.createElement("H2");

        var newEntryS = document.createElement("DIV");

        var newEntrySH3 = document.createElement("H3");

        var newEntryT = document.createElement("DIV");

        var newEntryTImg = document.createElement("DIV");

        var trashCans = document.getElementsByClassName("removeEntry");

        var forCounter;

        newEntryF.classList.add("entryFirst");

        newEntryFP.classList.add("date");

        newEntryFH2.classList.add("spendingLog");

        newEntryS.classList.add("entrySecond");

        newEntrySH3.classList.add("expenseExplanation");

        newEntryT.classList.add("entryThird");

        newEntryTImg.classList.add("removeEntry");

        newExpWrap.classList.add("expenseWrap");

        newEntryF.appendChild(newEntryFP);
        newEntryF.appendChild(newEntryFH2);
        newExpWrap.appendChild(newEntryF);
        newEntryS.appendChild(newEntrySH3);
        newExpWrap.appendChild(newEntryS);
        newEntryT.appendChild(newEntryTImg);
        newExpWrap.appendChild(newEntryT);
        newLi.appendChild(newExpWrap);
        ul.appendChild(newLi);


        var date = document.getElementById("formDate").value.trim();
        var decsr = document.getElementById("formDescr").value.trim();
        var originalName = document.getElementById("formDescr").value.trim();
        var amount = document.getElementById("formAmount").value.replace(/\s+/, "");
        var exType = buttonControls.exType;
        var repeatEntry = 0;

        //checks if there's an entry with same preferences already existing adds +1 to description if so


        finance.addedEntries.forEach(function(element) {

            if ((element.originalName == decsr || element.descrip == decsr) && element.date == date && (element.amount == amount || element.amount == -amount)) {

                repeatEntry++;

                finance.addedEntries.forEach(function(element) {

                    while (decsr + " (" + repeatEntry + ")" == element.descrip) {

                        repeatEntry++; //loops to add numerals till name is unique

                    }

                });

            }

        });

        repeatEntry > 0 ? decsr = decsr + " (" + repeatEntry + ")" : {}; //adds numeral in case repeats detected


        //inner values picked up from the submitted form
        newEntrySH3.innerText = decsr;
        newEntryFP.innerText = date;
        newEntryFH2.innerText = amount + " CZK";

        if (exType == "income" || exType == "expense") { //assign the color to expense/income

            exType == "income" ? newEntryFH2.classList.add("income") : newEntryFH2.classList.add("expense");

        }


        for (forCounter = 0; forCounter < trashCans.length; forCounter++) {

            trashCans[forCounter].addEventListener("click", buttonControls.removeEntry); //events for trashicns

        }

        finance.addedEntries[finance.addedEntries.length] = new finance.financeObject(date, amount, decsr, exType, originalName, finance.recountBalance) //Obj creation

        document.getElementById("formDate").value = "";
        document.getElementById("formDescr").value = "";
        document.getElementById("formDescr").value = "";
        document.getElementById("formAmount").value = "";

        buttonControls.closeIt.click();

    }

};

buttonControls.assignEvent();