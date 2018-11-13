var pagination = pagination || {}; (function() {
  function Pagination() {}
  Pagination.prototype = {
      render: function(obj) {
          this._wrapid = '#' + obj.wrapid;
          this._total = obj.total;
          this._pagesize = obj.pagesize;
          this._currentPage = obj.currentPage;
          this._cb = obj.onPagechange;
          if (obj.btnCount < 5) {
              obj.btnCount = 5;
          } else if (obj.btnCount % 2 == 0) {
              obj.btnCount = obj.btnCount + 1;
          }
          this._btnsValue = obj.btnCount ? obj.btnCount: 7;
          this._halfbtns = parseInt((this._btnsValue - 3) / 2);
          this._btnNum = obj.total / obj.pagesize > parseInt(obj.total / obj.pagesize) ? parseInt(obj.total / obj.pagesize) + 1 : parseInt(obj.total / obj.pagesize);
      },
      bindEvent: function() {
          var that = this;
          $(that._wrapid).on('click', '.pagenum',
          function() {
              that._currentPage = parseInt($(this).text());
              that._cb(that._currentPage);
              isshowMore.call(that);
          });
          $(that._wrapid).on('click', '#pagination-prev',
          function() {
              if ($(this).hasClass('pagination-disabled')) {
                  return;
              }
              that._currentPage--;
              $('#pagination-next').hasClass('pagination-disabled') && $('#pagination-next').removeClass('pagination-disabled');
              if (that._currentPage == 1) {
                  $('#pagination-prev').addClass('pagination-disabled');
              } else {
                  $('#pagination-prev').removeClass('pagination-disabled');
              }
              that._cb(that._currentPage);
              isshowMore.call(that);
          });
          $(that._wrapid).on('click', '#pagination-next',
          function() {
              if ($(this).hasClass('pagination-disabled')) {
                  return;
              }
              that._currentPage++;
              $('#pagination-prev').hasClass('pagination-disabled') && $('#pagination-prev').removeClass('pagination-disabled');
              if (that._currentPage == that._btnNum) {
                  $('#pagination-next').addClass('pagination-disabled');
              } else {
                  $('#pagination-next').removeClass('pagination-disabled')
              }
              that._cb(that._currentPage);
              isshowMore.call(that);
          });
          isshowMore.call(this);
          function isshowMore() {
              if (this._btnNum <= this._btnsValue) {
                  creatBtns.call(this, 'none')
              } else {
                  if (this._currentPage <= (this._btnsValue - 1 - this._halfbtns)) {
                      creatBtns.call(this, 'after');
                  } else if (this._currentPage >= this._btnNum - 1 - this._halfbtns) {
                      creatBtns.call(this, 'before')
                  } else {
                      creatBtns.call(this, 'all')
                  }
              }
          }
          function creatBtns(ismorePosition) {
              var html = '';
              var ismore = '<li class="pagination-ellipsis">...</li>';
              var firstbtn = '<li class="pagenum pagination-btn" data-num="1">1</li>';
              var lastbtn = '<li class="pagenum pagination-btn" data-num=' + this._btnNum + '>' + this._btnNum + '</li>';
              var prevbtn = '<span class="pagination-btn" id="pagination-prev"><</span>';
              var nextbtn = '<span class="pagination-btn" id="pagination-next">></span>'
              if (this._currentPage == 1) {
                  firstbtn = '<li class="pagenum pagination-btn pagination-current" data-num="1">1</li>';
                  prevbtn = '<span class="pagination-btn pagination-disabled" id="pagination-prev"><</span>'
              }
              if (this._currentPage == this._btnNum) {
                  lastbtn = '<li class="pagenum pagination-btn pagination-current" data-num=' + this._btnNum + '>' + this._btnNum + '</li>';
                  nextbtn = '<span class="pagination-btn pagination-disabled" id="pagination-next">></span>'
              }
              if (ismorePosition == 'none') {
                  for (var i = 1; i <= this._btnNum; i++) {
                      if (i == this._currentPage) {
                          html += '<li class="pagenum pagination-btn pagination-current" data-num=' + i + '>' + i + '</li>';
                      } else {
                          html += '<li class="pagenum pagination-btn" data-num=' + i + '>' + i + '</li>';
                      }
                  }
              }
              if (ismorePosition == "after") {
                  for (var i = 1; i <= this._btnsValue - 1; i++) {
                      if (i == this._currentPage) {
                          html += '<li class="pagenum pagination-btn pagination-current" data-num=' + i + '>' + i + '</li>';
                      } else {
                          html += '<li class="pagenum pagination-btn" data-num=' + i + '>' + i + '</li>';
                      }
                  }
                  html = html + ismore + lastbtn;
              }
              if (ismorePosition == "before") {
                  html = html + firstbtn + ismore;
                  for (var i = this._btnNum - (this._btnsValue - 2); i <= this._btnNum; i++) {
                      if (i == this._currentPage) {
                          html += '<li class="pagenum pagination-btn pagination-current" data-num=' + i + '>' + i + '</li>';
                      } else {
                          html += '<li class="pagenum pagination-btn" data-num=' + i + '>' + i + '</li>';
                      }
                  }
              }
              if (ismorePosition == "all") {
                  var halfnum = parseInt((this._btnsValue - 3) / 2);
                  html += firstbtn + ismore;
                  for (var i = (this._currentPage - halfnum); i <= this._currentPage + halfnum + ((this._btnsValue - 3) % 2); i++) {
                      if (i == this._currentPage) {
                          html += '<li class="pagenum pagination-btn pagination-current" data-num=' + i + '>' + i + '</li>'
                      } else {
                          html += '<li class="pagenum pagination-btn" data-num=' + i + '>' + i + '</li>'
                      }
                  }
                  html += ismore + lastbtn;
              }
              $(this._wrapid).html(prevbtn + '<ul class="pagination-wrap">' + html + '</ul>' + nextbtn);
          }
      },
      init: function(paginationObj) {
          this.render(paginationObj);
          this.bindEvent();
      }
  }
  pagination.init = function(paginationObj) {
      return new Pagination().init(paginationObj)
  }
})()