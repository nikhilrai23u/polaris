Route::get('/lpufile/{username}' , function($username) {
    return "welcome to home page" ; 
)} ; 

Route::get('/lpufile/{name}{last}' , function($username) {
    return "welcome to home page" ; 
)} ; 

Route::get('/lpufile/{a}{b}{c}' , function($sum) {
    return "sum = ${a} + ${b} + ${c}" ; 
)} ; 

Route::get('example/{num}' , function($number) {
    if($number%2 == 0) {
        return "even number" ; 
    } else {
        return "odd number" ; 
    }
)} ; 


Route::get('example/{a}/{b}' , function($number) {
    if(a > b) {
        return "a is largest" ; 
    } else {
        return "b is largest" ; 
    }
)} ;