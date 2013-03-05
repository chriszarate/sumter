/*
 * Sumter
 * https://github.com/chriszarate/Sumter
 * d391j46upa8a0p.cloudfront.net == files.zarate.org
 */

var a=document.createElement('script');
    a.setAttribute('src','<%= meta.hostedURL %>?<%= grunt.template.today(\'yyyymmdd\') %>');
document.getElementsByTagName('head')[0].appendChild(a);
