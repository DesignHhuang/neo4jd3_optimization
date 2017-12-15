import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import * as d3 from 'd3';
declare var System: any;
@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  neo4jData;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {

  }

  ngOnInit() {
    this.searchService.search_by_id(this.route.snapshot.params.id, "person").subscribe(r => {
      this.neo4jData = {
        "results": [{
          "columns": ["user", "entity"],
          "data": [{
            "graph": {
              "nodes": [{
                "id": "N0",
                "oper_id": r._id,
                "labels": ["Person"],
                "properties": {
                  "username": r.username ? r.username : "未知",
                  "password": r.password ? r.password : "未知",
                  "hash": r.hash ? r.hash : "未知",
                  "email": r.email ? r.email : "未知",
                  "QQ": r.QQ ? r.QQ : "未知",
                  "telephone": r.telephone ? r.telephone : "未知",
                  "mobile": r.mobile ? r.mobile : "未知",
                  "IDCard": r.IDCard ? r.IDCard : "未知",
                  "name_zh": r.name_zh ? r.name_zh : "未知",
                  "leak_src": r.leak_src ? r.leak_src : "未知",
                  "birthday": r.birthday ? r.birthday : "未知",
                  "address": r.address ? r.address : "未知"
                }
              }],
              "relationships": []
            }
          }]
        }],
        "errors": []
      }
      this.doSVG(this.neo4jData, this.searchService);
    });
  }

  doSVG(neo4jData, service) {
    System.import('../../../assets/lib/neo4jd3').then(neo => {
      var neo4jd3 = new neo.Neo4jD3('#neo4jd3', {
        highlight: [
          {
            class: 'Project',
            property: 'name',
            value: 'neo4jd3'
          }, {
            class: 'User',
            property: 'userId',
            value: 'eisman'
          }
        ],
        icons: {
          //                        'Address': 'home',
          'Api': 'gear',
          //                        'BirthDate': 'birthday-cake',
          'Cookie': 'paw',
          //                        'CreditCard': 'credit-card',
          //                        'Device': 'laptop',
          'Email': 'at',
          'Git': 'git',
          'Github': 'github',
          'Google': 'google',
          //                        'icons': 'font-awesome',
          'Ip': 'map-marker',
          'Issues': 'exclamation-circle',
          'Language': 'language',
          'Options': 'sliders',
          'Password': 'lock',
          'Phone': 'phone',
          'Project': 'folder-open',
          'SecurityChallengeAnswer': 'commenting',
          'Person': 'user',
          'zoomFit': 'arrows-alt',
          'zoomIn': 'search-plus',
          'zoomOut': 'search-minus'
        },
        images: {
          'Address': '../../../assets/img/twemoji/1f3e0.svg',
          //                        'Api': 'img/twemoji/1f527.svg',
          'BirthDate': '../../../assets/img/twemoji/1f382.svg',
          'Cookie': '../../../assets/img/twemoji/1f36a.svg',
          'CreditCard': '../../../assets/img/twemoji/1f4b3.svg',
          'Domain': '../../../assets/img/twemoji/1f4bb.svg',
          'Email': '../../../assets/img/twemoji/2709.svg',
          'Git': '../../../assets/img/twemoji/1f5c3.svg',
          'Country': '../../../assets/img/twemoji/1f30f.svg',
          'City': '../../../assets/img/twemoji/1f306.svg',
          'Isp': '../../../assets/img/twemoji/1f530.svg',
          'Github': '../../../assets/img/twemoji/1f5c4.svg',
          'icons': '../../../assets/img/twemoji/1f38f.svg',
          'Ip': '../../../assets/img/twemoji/1f4cd.svg',
          'Issues': '../../../assets/img/twemoji/1f4a9.svg',
          'Language': '../../../assets/img/twemoji/1f1f1-1f1f7.svg',
          'Options': '../../../assets/img/twemoji/2699.svg',
          'Password': '../../../assets/img/twemoji/1f511.svg',
          //                        'Phone': 'img/twemoji/1f4de.svg',
          'Project': '../../../assets/img/twemoji/2198.svg',
          'Project|name|neo4jd3': '../../../assets/img/twemoji/2196.svg',
          //                        'SecurityChallengeAnswer': 'img/twemoji/1f4ac.svg',
          //'User': '../../../assets/img/twemoji/1f600.svg'
          //                        'zoomFit': 'img/twemoji/2194.svg',
          //                        'zoomIn': 'img/twemoji/1f50d.svg',
          //                        'zoomOut': 'img/twemoji/1f50e.svg'
        },
        minCollision: 60,
        neo4jData: this.neo4jData,
        nodeRadius: 25,
        onNodeDoubleClick: function (d) {
          var elem = document.querySelectorAll("." + d.id);
          var i = elem.length;
          while (i--) {
            elem[i].setAttribute('style', "display:inline");
          }

          d3.select('#' + d.id + '>a#person-domain').on('click', function () {
            service.email2domain(d.properties.email).subscribe(r => {
              for (var key in r.ret_list) {
                if (r.ret_list[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.ret_list[key]._id,
                    "labels": ["Domain"],
                    "properties": {
                      "domain": r.ret_list[key].domain ? r.ret_list[key].domain : "未知",
                      "ip_block": r.ret_list[key].ip_block ? r.ret_list[key].ip_block : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "R" + size.relationships.toString(),
                    "type": "相同域名",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "domain": r.ret_list[key].domain ? r.ret_list[key].domain : "未知"
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#person-username').on('click', function () {
            service.advanced_person_search("username:" + d.properties.username, 1, 10).subscribe(r => {
              for (var key in r.json().person) {
                if (r.json().person[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.json().person[key]._id,
                    "labels": ["Person"],
                    "properties": {
                      "username": r.json().person[key].username ? r.json().person[key].username : "未知",
                      "password": r.json().person[key].password ? r.json().person[key].password : "未知",
                      "hash": r.json().person[key].hash ? r.json().person[key].hash : "未知",
                      "email": r.json().person[key].email ? r.json().person[key].email : "未知",
                      "QQ": r.json().person[key].QQ ? r.json().person[key].QQ : "未知",
                      "telephone": r.json().person[key].telephone ? r.json().person[key].telephone : "未知",
                      "mobile": r.json().person[key].mobile ? r.json().person[key].mobile : "未知",
                      "IDCard": r.json().person[key].IDCard ? r.json().person[key].IDCard : "未知",
                      "name_zh": r.json().person[key].name_zh ? r.json().person[key].name_zh : "未知",
                      "leak_src": r.json().person[key].leak_src ? r.json().person[key].leak_src : "未知",
                      "birthday": r.json().person[key].birthday ? r.json().person[key].birthday : "未知",
                      "address": r.json().person[key].address ? r.json().person[key].address : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "R" + size.relationships.toString(),
                    "type": "相同用户名",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "username": r.json().person[key].username
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#person-email').on('click', function () {
            service.advanced_person_search("email:" + d.properties.email, 1, 10).subscribe(r => {
              for (var key in r.json().person) {
                if (r.json().person[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.json().person[key]._id,
                    "labels": ["Person"],
                    "properties": {
                      "username": r.json().person[key].username ? r.json().person[key].username : "未知",
                      "password": r.json().person[key].password ? r.json().person[key].password : "未知",
                      "hash": r.json().person[key].hash ? r.json().person[key].hash : "未知",
                      "email": r.json().person[key].email ? r.json().person[key].email : "未知",
                      "QQ": r.json().person[key].QQ ? r.json().person[key].QQ : "未知",
                      "telephone": r.json().person[key].telephone ? r.json().person[key].telephone : "未知",
                      "mobile": r.json().person[key].mobile ? r.json().person[key].mobile : "未知",
                      "IDCard": r.json().person[key].IDCard ? r.json().person[key].IDCard : "未知",
                      "name_zh": r.json().person[key].name_zh ? r.json().person[key].name_zh : "未知",
                      "leak_src": r.json().person[key].leak_src ? r.json().person[key].leak_src : "未知",
                      "birthday": r.json().person[key].birthday ? r.json().person[key].birthday : "未知",
                      "address": r.json().person[key].address ? r.json().person[key].address : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "R" + size.relationships.toString(),
                    "type": "相同email",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "email": r.json().person[key].email
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#person-mobile').on('click', function () {
            service.advanced_person_search("mobile:" + d.properties.mobile, 1, 10).subscribe(r => {
              for (var key in r.json().person) {
                if (r.json().person[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.json().person[key]._id,
                    "labels": ["Person"],
                    "properties": {
                      "username": r.json().person[key].username ? r.json().person[key].username : "未知",
                      "password": r.json().person[key].password ? r.json().person[key].password : "未知",
                      "hash": r.json().person[key].hash ? r.json().person[key].hash : "未知",
                      "email": r.json().person[key].email ? r.json().person[key].email : "未知",
                      "QQ": r.json().person[key].QQ ? r.json().person[key].QQ : "未知",
                      "telephone": r.json().person[key].telephone ? r.json().person[key].telephone : "未知",
                      "mobile": r.json().person[key].mobile ? r.json().person[key].mobile : "未知",
                      "IDCard": r.json().person[key].IDCard ? r.json().person[key].IDCard : "未知",
                      "name_zh": r.json().person[key].name_zh ? r.json().person[key].name_zh : "未知",
                      "leak_src": r.json().person[key].leak_src ? r.json().person[key].leak_src : "未知",
                      "birthday": r.json().person[key].birthday ? r.json().person[key].birthday : "未知",
                      "address": r.json().person[key].address ? r.json().person[key].address : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "R" + size.relationships.toString(),
                    "type": "相同手机号码",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "mobile": r.json().person[key].mobile
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#person-idcard').on('click', function () {
            service.advanced_person_search("IDCard:" + d.properties.IDCard, 1, 10).subscribe(r => {
              for (var key in r.json().person) {
                if (r.json().person[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.json().person[key]._id,
                    "labels": ["Person"],
                    "properties": {
                      "username": r.json().person[key].username ? r.json().person[key].username : "未知",
                      "password": r.json().person[key].password ? r.json().person[key].password : "未知",
                      "hash": r.json().person[key].hash ? r.json().person[key].hash : "未知",
                      "email": r.json().person[key].email ? r.json().person[key].email : "未知",
                      "QQ": r.json().person[key].QQ ? r.json().person[key].QQ : "未知",
                      "telephone": r.json().person[key].telephone ? r.json().person[key].telephone : "未知",
                      "mobile": r.json().person[key].mobile ? r.json().person[key].mobile : "未知",
                      "IDCard": r.json().person[key].IDCard ? r.json().person[key].IDCard : "未知",
                      "name_zh": r.json().person[key].name_zh ? r.json().person[key].name_zh : "未知",
                      "leak_src": r.json().person[key].leak_src ? r.json().person[key].leak_src : "未知",
                      "birthday": r.json().person[key].birthday ? r.json().person[key].birthday : "未知",
                      "address": r.json().person[key].address ? r.json().person[key].address : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "N" + size.relationships.toString(),
                    "type": "相同身份证号",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "IDCard": r.json().person[key].IDCard
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#ipblock-ip').on('click', function () {
            service.ipblock2ip(d.properties.ip_block).subscribe(r => {
              for (var key in r.ret_list) {
                if (r.ret_list[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.ret_list[key]._id,
                    "labels": ["Ip"],
                    "properties": {
                      "ip": r.ret_list[key].ip ? r.ret_list[key].ip : "未知",
                      "server": r.ret_list[key].server ? r.ret_list[key].server : "未知",
                      "title": r.ret_list[key].title ? r.ret_list[key].title : "未知",
                      "location_country": r.ret_list[key].location_country ? r.ret_list[key].location_country : "未知",
                      "location_country_code": r.ret_list[key].location_country_code ? r.ret_list[key].location_country_code : "未知",
                      "location_postal_code": r.ret_list[key].location_postal_code ? r.ret_list[key].location_postal_code : "未知",
                      "metadata_product": r.ret_list[key].metadata_product ? r.ret_list[key].metadata_product : "未知",
                      "metadata_manufacturer": r.ret_list[key].metadata_manufacturer ? r.ret_list[key].metadata_manufacturer : "未知",
                      "location_city": r.ret_list[key].location_city ? r.ret_list[key].location_city : "未知",
                      "location_province": r.ret_list[key].location_province ? r.ret_list[key].location_province : "未知",
                      "location_latitude": r.ret_list[key].location_latitude ? r.ret_list[key].location_latitude : "未知",
                      "location_longitude": r.ret_list[key].location_longitude ? r.ret_list[key].location_longitude : "未知",
                      "html": r.ret_list[key].html ? r.ret_list[key].html : "未知",
                      "timestamp": r.ret_list[key].timestamp ? r.ret_list[key].timestamp : "未知",
                      "language": r.ret_list[key].language ? r.ret_list[key].language : "未知",
                      "autonomous_system_asn": r.ret_list[key].autonomous_system_asn ? r.ret_list[key].autonomous_system_asn : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "N" + size.relationships.toString(),
                    "type": "相同IP块下的IP",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "ip_block": d.properties.ip_block
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#ip-country').on('click', function () {
            service.ip2country(d.properties.location_country).subscribe(r => {
              for (var key in r.ret_list) {
                if (r.ret_list[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.ret_list[key]._id,
                    "labels": ["Country"],
                    "properties": {
                      "location_country_code": r.ret_list[key].location_country_code ? r.ret_list[key].location_country_code : "未知",
                      "code": r.ret_list[key].code ? r.ret_list[key].code : "未知",
                      "location_continent": r.ret_list[key].location_continent ? r.ret_list[key].location_continent : "未知",
                      "location_country": r.ret_list[key].location_country ? r.ret_list[key].location_country : "未知",
                      "location_continent_code": r.ret_list[key].location_continent_code ? r.ret_list[key].location_continent_code : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "N" + size.relationships.toString(),
                    "type": "所在国家",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "ip": d.properties.ip
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#ip-city').on('click', function () {
            service.ip2city(d.properties.location_city).subscribe(r => {
              for (var key in r.ret_list) {
                if (r.ret_list[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.ret_list[key]._id,
                    "labels": ["City"],
                    "properties": {
                      "location_country_code": r.ret_list[key].location_country_code ? r.ret_list[key].location_country_code : "未知",
                      "location_province": r.ret_list[key].location_province ? r.ret_list[key].location_province : "未知",
                      "location_country": r.ret_list[key].location_country ? r.ret_list[key].location_country : "未知",
                      "location_timezone": r.ret_list[key].location_timezone ? r.ret_list[key].location_timezone : "未知",
                      "location_province_code": r.ret_list[key].location_province_code ? r.ret_list[key].location_province_code : "未知",
                      "location_city": r.ret_list[key].location_city ? r.ret_list[key].location_city : "未知",
                      "location_continent": r.ret_list[key].location_continent ? r.ret_list[key].location_continent : "未知",
                      "location_continent_code": r.ret_list[key].location_continent_code ? r.ret_list[key].location_continent_code : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "N" + size.relationships.toString(),
                    "type": "所在城市",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "ip": d.properties.ip
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#ip-isp').on('click', function () {
            service.ip2isp(d.properties.autonomous_system_asn).subscribe(r => {
              for (var key in r.ret_list) {
                if (r.ret_list[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.ret_list[key]._id,
                    "labels": ["Isp"],
                    "properties": {
                      "autonomous_system_asn": r.ret_list[key].autonomous_system_asn ? r.ret_list[key].autonomous_system_asn : "未知",
                      "isp": r.ret_list[key].isp ? r.ret_list[key].isp : "未知",
                      "organization": r.ret_list[key].organization ? r.ret_list[key].organization : "未知",
                      "ip_block": r.ret_list[key].ip_block ? r.ret_list[key].ip_block : "未知",
                      "autonomous_system_organization": r.ret_list[key].autonomous_system_organization ? r.ret_list[key].autonomous_system_organization : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "N" + size.relationships.toString(),
                    "type": "所用的ISP",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "ip": d.properties.ip
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
          d3.select('#' + d.id + '>a#advance-ip-search').on('click', function () {
            var searchkey;
            switch (d.labels[0]) {
              case "Country":
                searchkey = "location_country:" + d.properties.location_country;
                break;
              case "City":
                searchkey = "location_city:" + d.properties.location_city;
                break;
              case "Isp":
                searchkey = "autonomous_system_asn:" + d.properties.autonomous_system_asn;
                break;
            }
            service.getResult(searchkey, 1, 10).subscribe(r => {
              for (var key in r.json().ips) {
                if (r.json().ips[key]._id != d.oper_id) {
                  var nodes = []; var relationships = [];
                  var size = neo4jd3.size();
                  var itemnode = {
                    "id": "N" + size.nodes.toString(),
                    "oper_id": r.json().ips[key]._id,
                    "labels": ["Ip"],
                    "properties": {
                      "ip": r.json().ips[key].ip ? r.json().ips[key].ip : "未知",
                      "title": r.json().ips[key].title ? r.json().ips[key].title : "未知",
                      "location_country": r.json().ips[key].location_country ? r.json().ips[key].location_country : "未知",
                      "location_country_code": r.json().ips[key].location_country_code ? r.json().ips[key].location_country_code : "未知",
                      "location_postal_code": r.json().ips[key].location_postal_code ? r.json().ips[key].location_postal_code : "未知",
                      "metadata_product": r.json().ips[key].metadata_product ? r.json().ips[key].metadata_product : "未知",
                      "metadata_manufacturer": r.json().ips[key].metadata_manufacturer ? r.json().ips[key].metadata_manufacturer : "未知",
                      "location_city": r.json().ips[key].location_city ? r.json().ips[key].location_city : "未知",
                      "location_province": r.json().ips[key].location_province ? r.json().ips[key].location_province : "未知",
                      "location_latitude": r.json().ips[key].location_latitude ? r.json().ips[key].location_latitude : "未知",
                      "location_longitude": r.json().ips[key].location_longitude ? r.json().ips[key].location_longitude : "未知",
                      "html": r.json().ips[key].html ? r.json().ips[key].html : "未知",
                      "timestamp": r.json().ips[key].timestamp ? r.json().ips[key].timestamp : "未知",
                      "autonomous_system_asn": r.json().ips[key].autonomous_system_asn ? r.json().ips[key].autonomous_system_asn : "未知"
                    }
                  }
                  var itemrelationship = {
                    "id": "N" + size.relationships.toString(),
                    "type": "存在的IP",
                    "startNode": d.id,
                    "endNode": "N" + size.nodes.toString(),
                    "properties": {
                      "ip": r.json().ips[key].ip
                    },
                    "source": d.id,
                    "target": "N" + size.nodes.toString(),
                    "linknum": 1
                  }
                  nodes.push(itemnode);
                  relationships.push(itemrelationship);
                  var newnode = { "nodes": nodes, "relationships": relationships };
                  neo4jd3.updateWithD3Data(newnode);
                }
              }
              var elem = document.querySelectorAll("." + d.id);
              var i = elem.length;
              while (i--) {
                elem[i].setAttribute('style', "display: none");
              }
            })
          })
        },
        onNodeClick: function (d) {
          var elem = document.querySelectorAll("." + d.id);
          var i = elem.length;
          while (i--) {
            elem[i].setAttribute('style', "display: none");
          }
        },
        onRelationshipDoubleClick: function (relationship) {
          console.log('double click on relationship: ' + JSON.stringify(relationship));
        },
        zoomFit: false
      });
    });
  }

}
