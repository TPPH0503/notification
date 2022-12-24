$(document).ready(function(){   
    load_page();  

});
function load_page(){
    setTimeout(function() {
        $('.sgroup').sortable({
            tolerance: "pointer",
            scroll: true, scrollSensitivity: 100, scrollSpeed: 100,
            distance:1,
            revert: '200',
        update:function(event,ui){
            $(this).children().each(function(index){
                if($(this).attr('data-position') !=(index+1)){
                    $(this).attr('data-position',(index+1)).addClass('updated');
                }
            });
            saveNewSections();
        }
        });
    $('.tgroup').sortable({
        connectWith:'.tgroup',
        placeholder:'increase-task',
        tolerance: "pointer",
        revert: '200',
        scroll: true, scrollSensitivity: 100, scrollSpeed: 100,
        start: function (event, ui) { 
            $(ui.placeholder).hide(300);
            ui.placeholder.html("Drop in here");
        },
        change: function (e,ui){
            $(ui.placeholder).hide().show(300);
        },
        update:function(event,ui){
            
            $(this).children().each(function(index){
                if($(this).attr('data-position') !=(index+1)){
                    $(this).attr('data-position',(index+1)).addClass('updated');
                }
            });
            saveNewTask(ui.item);
            
        },
        stop:function(event,ui){
            ui.item.addClass('update-section-in-task');
            insertTask(ui.item);
        },
        
        
        
    });
    $('.tgroup').on('mousedown',function(){
        $('.tgroup').each(function(index){
            if($(this).height() == 0){
                $(this).addClass('increase-task2');
            }
        });
    }).on('mouseup',function(){
        $('.tgroup').each(function(index){
            $(this).removeClass('increase-task2');
        });
    })
    
    
    
    },500)
}
//update cac task
async function saveNewTask(){
    var pi = $('.sgroup').attr('data-project-id');
    var positions =[];
    $('.updated').each(function(){
        positions.push([$(this).attr('data-index'),$(this).attr('data-position'),$(this).attr('data-section-id'),pi]);
        $(this).removeClass('updated');
    })

    await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/task-update',
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(positions),
            success:function(res){
                angular.element(document.getElementById('taskController')).scope().handle_tasks_drop(positions);
                console.log('CHUYEN TASK OK')
            },
            error:function(resp){
                console.log('CHUYEN TASK KO OK')
            }
        });    
}


//insert cac task
async function insertTask(item){
    var pi = $('.sgroup').attr('data-project-id');
    var username = sessionStorage.getItem("user");
    var newsectionID = 0;
    $('.update-section-in-task').each(function(){
        newsectionID = $(this).parent().attr('id') ;
        $(this).removeClass('update-section-in-task');
    })
    if(newsectionID == item.attr('data-section-id')) return;
    var positions =[];
    positions.push([item.attr('data-index'),item.attr('data-position'),item.attr('data-section-id'),newsectionID,pi]);
    await  $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/task-insert/' + username,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(positions),
            success:function(res){
                item.attr('data-section-id',newsectionID);
                angular.element(document.getElementById('taskController')).scope().handle_task_drop(positions);
                console.log('Them TASK OK')
            },
            error:function(resp){
                console.log('Them TASK KO OK');
                console.log(positions);
            }
        });
}

//update section
async function saveNewSections(){
    var pi = $('.sgroup').attr('data-project-id');
    var positions =[];
    $('.updated').each(function(){
        positions.push([$(this).attr('data-index'),$(this).attr('data-position'),pi]);
        $(this).removeClass('updated');
    })
    return await $.ajax({
        url: 'http://103.160.2.51:8080/pmf/pmf/project/section-update',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(positions),
        success:function(res){
            angular.element(document.getElementById('taskController')).scope().handle_sections_drop(positions);
            console.log('hay ban oi')
        },
        error:function(resp){
            console.log('ga qua ban oi')
        }
    });           

}



   function clone_task(element){
    var container_task = $($($($(element).parent()).parent()).children()).first();
     addTask(container_task);
    var newTask =  $($($($('.coppy-task').children()).last()).children()).first();
    h6_into_testarea($(newTask));
    
  }


  function h6_into_testarea(element){
    $(element).replaceWith(function () {
        return "<textarea placeholder='Task name'  onfocusout='textarea_into_h6(this)' class='rplha border-0 textarea'></textarea>";
    });
    $('.rplha').focus();
    $('.rplha').removeClass('rplha');
  }

    function textarea_into_h6(element) {
    var pi = $('.sgroup').attr('data-project-id');
    if($(element).val() == ''){
        $($(element).parent()).parent().remove();
        return;
    }
    var parent = $($(element).parent()).parent();
    var position = parseInt($(parent).attr('data-position')) + 1;
    var section = $(parent).parent().attr('id');
    var taskname = $(element).val();
    var info =[taskname,position,section,pi];
     $.ajax({
        url: 'http://103.160.2.51:8080/pmf/pmf/project/task-create',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(info),
        success:function async(res){
            $(parent).attr('data-index',res.taskID);
            $(parent).attr('id',res.taskID);
            angular.element(document.getElementById('taskController')).scope().pushTaskElement(res,parent);   
        },
        error:function(resp){
            console.log(JSON.stringify(info));
            console.log('ga qua ban oi')
        }
    });           
    $(parent).attr('data-position',position);
    $(parent).attr('data-section-id',section);
    $(parent).removeClass('coppy-task');

    $(element).replaceWith(function () {
        return "<h6>"+$(this).val()+"</h6>";
    });

    load_page();
  }



  //Phân đoạn tái tạo thành phần mới
  function tagCreate(tag, className) {
    const newTag = document.createElement(tag);
    newTag.className = className;
    return newTag;
}

//Tạo task mới
function addTask(element) {
    //Create subtag in task
    const node = tagCreate("div", "task-list row coppy-task");
    const divIc = tagCreate("div", "icon-task");
    const icon = tagCreate("i", "fa fa-check-circle-o mr-2");
    const content = tagCreate("div", "content-task");
    const h6 = tagCreate("h6", "border-0 textarea");
    //
    
    node.dataset.index = "0";
    node.dataset.position = $(element).children().length;
    node.dataset.sectionId = $(element).attr('id');
    //
    content.appendChild(h6);
    divIc.appendChild(icon);
    node.appendChild(divIc);
    node.appendChild(content);

    //
    $(element).append(node);
    
    
};

//Section
//Open input section
function open_input_section(element) {
    $(element).css({'display':'none'});
    $("#in-nameSection").css({'display':'block'})
    $("#in-nameSection").focus();
}

//Main activity
function check_name_section(element){
    $(element).css({'display':'none'});
    $("#btn-addSection").css({'display':'block'})
    if($(element).val() != "")add_section($(element).val());
    $(element).val("");
}

//Tạo section mới
function add_section(text) {
    //Create tag
    const tagH6 = tagCreate("h6", "");
    const newColumneTag = tagCreate("div", "new-columne columne-data sec-list");
    const headerColumne = tagCreate("div", "header-column row-columne");
    const columneName = tagCreate("div", "columne-name mb-2 mt-2 pl-2 pr-2");
    const plushTag = tagCreate("div", "plush d-flex");
    const buttonPlush = tagCreate("button", "");
    const buttonMore = tagCreate("button", "");
    const iconPlush = tagCreate("i", "fa fa-plus text-secondary");
    const iconMore = tagCreate("i", "fa fa-ellipsis-h text-secondary");
    const listTag = tagCreate("div", "list");
    const columeTitle = tagCreate("div", "colume-title");
    const columneTag = tagCreate("div", "columne");
    const columneInTask = tagCreate("div", "columne-in-task tgroup");
    const addNewTag = tagCreate("div", "btn-new-task mb-5 mt-2 ");
    const buttonNewTag = tagCreate("button", "btn");
    //Dropdow menu
    const dropdownMenu = tagCreate("div", "dropdown-menu");
    const buttonDropDown = tagCreate("button", "dropdown-item text-danger btn-remove-section");
    //Total columne created
    var totalNewColumne = document.getElementsByClassName("new-columne").length - 1;
    //
    buttonDropDown.innerHTML = "<i class='fa fa-trash-o'></i> Delete section";
    buttonDropDown.addEventListener('click', () => { delete_section(buttonDropDown); });
    // Tag input to class ColumneName(Part class header columne)
    tagH6.innerHTML = text;
    tagH6.addEventListener('click', () => {h6_into_input(tagH6); });
    columneName.appendChild(tagH6);
    buttonPlush.appendChild(iconPlush); //Add iconPlush to button Plush
    buttonMore.appendChild(iconMore); //Add iconMore to button More
    //Add more Utilities to button more
    buttonMore.dataset.toggle = "dropdown";
    buttonMore.addEventListener('click',() => {check_delete_section()})
    //Add buttons to class pushTag and dropdown menu
    plushTag.appendChild(buttonPlush);
    //Dropdown menu add button delete section
    dropdownMenu.appendChild(buttonDropDown);
    //Class plush add class drop down
    plushTag.appendChild(dropdownMenu);
    plushTag.appendChild(buttonMore);
    //Add appenChild class HeaderColumne and add Utilites for columneName
    columneName.addEventListener('mouseover', () => { mouseOver(columneName); });
    columneName.addEventListener('mouseout', () => { mouseOut(columneName); });
    headerColumne.appendChild(columneName);
    headerColumne.appendChild(plushTag);
    //Add appenChild class List(part class List)
    columneTag.appendChild(columneInTask);
    //Add more to button new task(event, more,...)
    buttonNewTag.innerHTML = " <b>+</b> Add new task";
    //
    buttonNewTag.addEventListener('click', () => { clone_task(buttonNewTag); });
    addNewTag.appendChild(buttonNewTag);
    columneTag.appendChild(addNewTag);
    //
    columeTitle.appendChild(columneTag);
    //
    listTag.appendChild(columeTitle);
    //
    newColumneTag.appendChild(headerColumne);
    newColumneTag.appendChild(listTag);


    
    var position = $('.sgroup').children().length + 1;
    newColumneTag.dataset.index= "0";
    newColumneTag.dataset.position=position;
    var pi = $('.sgroup').attr('data-project-id');
    var infor = [text,position,pi];
    //Add somes tag created to tagFather
    
    var tagFather = document.getElementById("main");

    add_section_2(newColumneTag,columneInTask,infor);
}

async function add_section_2(element_parent,element_child,infor){   
 await   $.ajax({
        url: 'http://103.160.2.51:8080/pmf/pmf/project/section-create',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(infor),
        success: async function(res){
            $(element_parent).attr('data-index',res.sectionID);
            $(element_parent).attr('id',res.sectionID);
            $(element_child).attr('id',res.sectionID);
            await angular.element(document.getElementById('taskController')).scope().pushSectionElement(res, $(element_parent));
            console.log(res);
        },
        error:function(resp){
            console.log(JSON.stringify(infor));
            console.log('ga qua ban oi')
        },
        done:function(res){
           
        }
    });


              
}

//delete section
function check_delete_section(){
    var check  = $('.btn-remove-section').length == 1 ? true : false;
    if(check == true){
        $('.btn-remove-section').addClass('btn-remove-section-disable')
    }else{
        $('.btn-remove-section').removeClass('btn-remove-section-disable')
    }
    $('.btn-remove-section').attr('disabled', check);
}

  function delete_section(element){
    var pi = $('.sgroup').attr('data-project-id');
    var present_section = $($($($(element).parent()).parent()).parent()).parent();
    var infor  = [$(present_section).attr('id'),pi];
     $(present_section).remove();   
     $('.sgroup').children().each(function(index){
        if($(this).attr('data-position') !=(index+1)){
            $(this).attr('data-position',(index+1)).addClass('updated');
        }
    });

    $.when(delete_section_api(infor)).then(function( data, textStatus, jqXHR ) {
        saveNewSections();
      });  
    
}
const delete_section_api = async (infor) => {
    return await $.ajax({
        url: 'http://103.160.2.51:8080/pmf/pmf/project/section-delete',
        type: 'DELETE',
        contentType: "application/json",
        data: JSON.stringify(infor),
        success:  function(res){
            angular.element(document.getElementById('taskController')).scope().delete_section(infor[0]);
            console.log('hay ban');
        },
        error:function(resp){
            console.log(JSON.stringify(infor));
            console.log('ga qua ban oi')
        }
        });
}

