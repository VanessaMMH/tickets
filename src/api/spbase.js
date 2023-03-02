import {sp, PrincipalType, PrincipalSource, RoleType} from '@pnp/sp/presets/all';
import {SPHttpClient} from '@microsoft/sp-http';

if(location.hostname=='localhost'||location.hostname.indexOf("192.168")==0){
    sp.setup({
        sp: {
          baseUrl: `http://${window.location.hostname}:8080`,
        },
    });
}

let currentContext = null;

export function initialize(ctx){
    sp.setup({
        spfxContext: ctx
    });

    currentContext = ctx;
}

export async function getRootFolder(lista){
    return sp.web.lists.getByTitle(lista).rootFolder.get();
}

export async function getItemById(lista, id, fields, expand){
    let item = null;
    try{
        let req = sp.web.lists.getByTitle(lista).items.getById(id).select(fields?fields:"*");
        if(expand) req = req.expand(expand);
        item = await req.get();
    }catch{
        item = null;
    }
    return item;
}

export async function breakRoleInheritance(lista, id, copyRoleAssignments, clearSubscopes){
    let item = false;
    try{
        let req = await sp.web.lists.getByTitle(lista).items.getById(id).breakRoleInheritance(copyRoleAssignments, clearSubscopes);
        item = true;
    }catch{
        item = false;
    }
    return item;
}



export async function getItemByTitle(lista, title, fields, expand, top){
    let item = null;
    try{
        let req = sp.web.lists.getByTitle(lista).items.filter(`Title eq '${title}'`).select(fields?fields:"*").top(top?top:5000);
        if(expand) req = req.expand(expand);
        item = (await req.get())[0];
    }catch{
        item = null;
    }
    return item;
}
// const getTickets = async (query) => await getItems('Ticket', query, '*,Categoria/Title','Categoria');

export async function getItems(lista, query, fields, expand, top, orderby){
    let items = [];
    try{
        let req = sp.web.lists.getByTitle(lista).items.select(fields?fields:"*").top(top?top:5000);
        if(expand) req = req.expand(expand);
        if(query) req = req.filter(query);
        if(orderby){            
            for(let ob of orderby){
                req = req.orderBy(ob.field, ob.ascending);
            }
        }
        items = await req.get();
        
        
    }catch(ex){
        items = [];
    }
  
    return items;
}

export async function getAllItems(lista, query, fields, expand, orderby){
    let items = [];
    try{
        let req = sp.web.lists.getByTitle(lista).items.select(fields?fields:"*");
        if(expand) req = req.expand(expand);
        if(query) req = req.filter(query);
        items = await req.getAll();
    }catch(ex){
        items = [];
    }
    return items;
}

export async function getChoiceValues(lista, field){
    let items = [];
    try{
        let spItems = await sp.web.lists.getByTitle(lista).fields.filter(`EntityPropertyName eq '${field}'`).get();
        if(spItems.length>0){
            items = spItems[0].Choices;
        }
    }catch(ex){
        items = [];
    }
    return items;
}

export async function getFields(lista){
    let items = [];
    try{
        let spItems = await sp.web.lists.getByTitle(lista).fields.filter(`Hidden eq false`).get();
        if(spItems.length>0){
            items = spItems;
        }
    }catch(ex){
        items = [];
    }
    return items;
}

export async function getEditableFields(lista){
    let items = [];
    try{
        let spItems = await sp.web.lists.getByTitle(lista).fields.filter(`(Hidden eq false and CanBeDeleted eq true) or (InternalName eq 'Title')`).get();
        if(spItems.length>0){
            items = spItems;
        }
    }catch(ex){
        items = [];
    }
    return items;
}

export async function getAttachments(lista, id){
    const item = sp.web.lists.getByTitle(lista).items.getById(id);
    const files = await item.attachmentFiles.get();

    return files;
}

export async function addAttachment(lista, id, file){
    try{
        const item = sp.web.lists.getByTitle(lista).items.getById(id);
        await item.attachmentFiles.add(file.name, file.content);        
    }
    catch{
        return false;
    }
    return true;
}

export async function addAttachments(lista, id, files){
    try{
        const item = sp.web.lists.getByTitle(lista).items.getById(id);
        await item.attachmentFiles.addMultiple(files);        
    }
    catch{
        return false;
    }
    return true;
}

export async function updateAttachments(lista, id, files){
    try{
        const item = sp.web.lists.getByTitle(lista).items.getById(id);
        
        for(const file of files){
            await item.attachmentFiles.getByName(file.name).setContent(file.content);
        }        
    }
    catch{
        return false;
    }
    return true;
}

export async function deleteAttachment(lista, id, filename){
    try{
        const item = sp.web.lists.getByTitle(lista).items.getById(id);
        await item.attachmentFiles.getByName(filename).delete();
    }
    catch{
        return false;
    }
    return true;
}

export async function deleteAttachments(lista, id, filenames){
    try{
        const item = sp.web.lists.getByTitle(lista).items.getById(id);
        await item.attachmentFiles.deleteMultiple(filenames);
    }
    catch{
        return false;
    }
    return true;
}

export async function cleanItem(lista, item, fields){
    const _fields = fields? fields : (await getEditableFields(lista)).map(f => ['Lookup','User'].indexOf(f.TypeAsString) >=0?`${f.InternalName}Id`: f.InternalName).concat(['Id']);

    const deleteFields = [];
    let _item = {...item};
    for(var prop in item){
        if(_fields.indexOf(prop)<0){
            deleteFields.push(prop);
        }
    }
    deleteFields.forEach((prop)=>{ delete _item[prop]; });

    return _item;
}

export async function cleanItems(lista, items){
    const fields = (await getEditableFields(lista)).map(f => ['Lookup','User'].indexOf(f.TypeAsString) >=0?`${f.InternalName}Id`: f.InternalName).concat(['Id']);
    return await Promise.all(items.map(async it => await cleanItem(lista, it, fields)));
}

export async function  ensureUser(user){
    let item = {Id: 0};
    try{
        item = await sp.web.ensureUser(user);
    }catch(ex){
        item = {Id: 0};
    }
    return item;
}

export async function  getCurrentUser(){
    let item = {Id: 0};
    try{
        item = await sp.web.currentUser.expand('Groups').get();
    }catch(ex){
        item = {Id: 0};
    }
    return item;
}

export async function getSiteGroups(q){
    let items = [];
    try{
        const root = sp.web.siteGroups;
        items = await (q?root.filter(q):root).get();
    }catch(ex){
        items = [];
    }
    return items;
}

export async function getGroupUsers(name){
    let items = [];
    try{
        let itemsG = await sp.web.siteGroups.getByName(name).expand("Users").get();
        if(itemsG!=null && itemsG.Users.length > 0){
            items = itemsG.Users;
        }
    }catch(ex){
        items = [];
    }
    return items;
}

export async function getGroup(name){ return await sp.web.siteGroups.getByName(name).expand("Users").get(); }

export async function getMembersGroup(){
    return await sp.web.associatedMemberGroup.expand("Users").get();
}

export async function getOwnersGroup(){
    return await sp.web.associatedOwnerGroup.expand("Users").get();
}

export async function getVisitorsGroup(){
    return await sp.web.associatedVisitorGroup.expand("Users").get();
}

export async function createGroup(name){
    try{
        const group = await sp.web.siteGroups.add({Title: name, OnlyAllowMembersViewMembership: false, AllowMembersEditMembership: false});
        
        return group.data;
    }catch{
        return null;
    }
}

export async function deleteGroup(name){
    try{
        const group = await sp.web.siteGroups.removeByLoginName(name);
        
        return group.data;
    }catch{
        return null;
    }
}

export async function deleteGroupById(id){
    try{
        const group = await sp.web.siteGroups.removeById(id);
        
        return group.data;
    }catch{
        return null;
    }
}

export async function deleteGroups(names){
    try{
        const [groups] = await Promise.all(names.map(name => sp.web.siteGroups.removeByLoginName(name)));
        
        return groups.map(g=>g.data);
    }catch{
        return null;
    }
}

export async function renameGroup(oldname, newname){
    try{
        const group = await sp.web.siteGroups.getByName(oldname).update({Title: newname});
        return group.data;
    }catch{
        return false;
    }
}
export async function changeGroupName(groupid, newname){
    try{
        const group = await sp.web.siteGroups.getById(groupid).update({Title: newname});
        return group.data;
    }catch{
        return false;
    }
}

export async function createDocumentSet(libTitle, parentFolderUrl, name){
    try{
        const documentSetContentTypeId = "0x0120D520";
        const dsFolder = await sp.web.getFolderByServerRelativeUrl(parentFolderUrl).addSubFolderUsingPath(name);
        const item = await sp.web.getFolderByServerRelativeUrl(parentFolderUrl).folders.getByName(name).listItemAllFields.get();
        await sp.web.lists.getByTitle(libTitle).items.getById(item.Id).update({
            ContentTypeId: documentSetContentTypeId
        });

        return {item: item, folder: dsFolder};
    }catch{
        return null;
    }
}


export async function assignItemContributor(prinId, list, itemId){
    try{
        await assignItemRole(prinId, sp.web.lists.getByTitle(list).items.getById(itemId), RoleType.Contributor);
        
        return true;
    }catch{
        return false;
    }
}

export async function assignItemReader(prinId, list, itemId){
    try{
        await assignItemRole(prinId, sp.web.lists.getByTitle(list).items.getById(itemId), RoleType.Reader);
        
        return true;
    }catch{
        return false;
    }
}

async function assignItemRole(prinId, item, roleType){
    try{
        const roleDef = await sp.web.roleDefinitions.getByType(roleType).get();        
        await item.roleAssignments.add(prinId, roleDef.Id);
        
        return true;
    }catch{
        return false;
    }
}

export async function removeItemContributor(prinId, list, itemId){
    try{
        await removeItemRole(prinId, sp.web.lists.getByTitle(list).items.getById(itemId), RoleType.Contributor);
        
        return true;
    }catch{
        return false;
    }
}

async function removeItemRole(prinId, item, roleType){
    try{
        const roleDef = await sp.web.roleDefinitions.getByType(roleType).get(); 
        await item.roleAssignments.remove(prinId, roleDef.Id);
        
        return true;
    }catch{
        return false;
    }
}


export async function assignWebReader(prinId){
    try{
        const roleDef = await sp.web.roleDefinitions.getByType(RoleType.Reader).get();
        await sp.web.roleAssignments.add(prinId, roleDef.Id);
        
        return true;
    }catch{
        return false;
    }
}

export async function addUserToGroup(userLoginName, groupId){
    try{
        const user = await sp.web.siteGroups.getById(groupId).users.add(userLoginName);

        return user;
    }catch{
        return false;
    }
}

export async function changeGroupOwner(userId, groupId){
    try{
        //await sp.web.siteGroups.getById(groupId).setUserAsOwner(userId);
        await SetOwner(groupId, userId);

        return true;
    }catch{
        return false;
    }
}


const SetOwner = (groupId, ownerGroupId) => { 
    const ctx = getContext();
    const endpoint = ctx.pageContext.site.serverRelativeUrl + `/_vti_bin/client.svc/ProcessQuery`;
    
    const body = 
        `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName=".NET Library" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009">
            <Actions>
                <SetProperty Id="1" ObjectPathId="2" Name="Owner">
                    <Parameter ObjectPathId="3" />
                </SetProperty>
                <Method Name="Update" Id="4" ObjectPathId="2" />
            </Actions>
            <ObjectPaths>
                <Identity Id="2" Name="740c6a0b-85e2-48a0-a494-e0f1759d4aa7:site:${ctx.pageContext.site.id}:g:${groupId}" />
                <Identity Id="3" Name="740c6a0b-85e2-48a0-a494-e0f1759d4aa7:site:${ctx.pageContext.site.id}:g:${ownerGroupId}" />
            </ObjectPaths>
        </Request>`;

    var headers = {
        "content-type": "text/xml"
    };

    var options = {
        body:body,
        header:headers
    };

    return ctx.spHttpClient.post(endpoint, SPHttpClient.configurations.v1,options).then((response) => { return response });
 }

export async function getUserById(id){
    let item = {Id: 0, Title: ''};
    try{
        item = await sp.web.siteUsers.getById(id).expand('Groups').get();
    }catch(ex){
        item = {Id: 0, Title: ''};
    }
    return item;
}

export async function getUserByEmail(email){
    let item = {Id: 0, Title: ''};
    try{
        let items = await sp.web.siteUsers.filter(`EMail eq '${email}'`).select("Id").expand('Groups').get();
        item = items[0];
    }catch(ex){
        item = {Id: 0, Title: ''};
    }
    return item;
}

export function saveItem (lista, item){
    return new Promise((resolve, reject)=>{
        if(item.Id && item.Id>0){
            sp.web.lists.getByTitle(lista).items.getById(item.Id).update(item).then(function(res){
                res.item.get().then(function(it){ resolve(it); });                    
            }, function(error){
                reject(error);
            });
        } else {
            sp.web.lists.getByTitle(lista).items.add(item).then(function(res){
                resolve(res.data);
            }, function(error){
                reject(error);
            });
        }
    });
}

export function saveItems (lista, items){
    return new Promise((resolve, reject)=>{
        let batch = sp.web.createBatch();
        let results = [];
        
        for(let i=0; i<items.length; i++){
            let item = items[i];

            if(item.Id && item.Id > 0){
                sp.web.lists.getByTitle(lista).items.getById(item.Id).inBatch(batch).update(item).then(function(){
                    results.push(true);
                }, function(err){
                    results.push(false);
                });
            } else {
                sp.web.lists.getByTitle(lista).items.inBatch(batch).add(item).then(function(){
                    results.push(true);
                }, function(err){
                    results.push(false);
                });
            }
        }

        batch.execute().then(function(){
                let resFinal = true;
                for(let j=0; j<results.length; j++){
                    if(!results[j]){
                        resFinal = false;
                        break;
                    }
                }
                resolve(resFinal);
        }, function(err){
            reject(false);
        });
    });
}

export function deleteItem (lista, id){
    return new Promise((resolve, reject)=>{            
        sp.web.lists.getByTitle(lista).items.getById(id).delete().then(function(res){
            resolve(res.data);
        }, function(){
            reject(false);
        });
    });
}

export function deleteItems (lista, ids){
    return new Promise((resolve, reject)=>{
        let batch = sp.web.createBatch();
        let results = [];

        if(ids.length>0){
            for(let i=0; i<ids.length; i++){
                sp.web.lists.getByTitle(lista).items.getById(ids[i]).inBatch(batch).delete().then(function(){
                    results.push(true);
                }, function(){
                    results.push(true);
                });
            }
                    
            batch.execute().then(function(){
                    let resFinal = true;
                    for(let j=0; j<results.length; j++){
                        if(!results[j]){
                            resFinal = false;
                            break;
                        }
                    }
                    resolve(resFinal);
            }, function(){
                reject(false);
            });
        } else {
            resolve(true);
        }
    });
}

export function deleteWhereItems (lista, query){
    return new Promise((resolve, reject)=>{
        let batch = sp.web.createBatch();
        let results = [];
    
        getItems(lista, query).then(function(items){	
            if(items.length>0){
                for(let i=0; i<items.length; i++){
                    sp.web.lists.getByTitle(lista).items.getById(items[i].Id).inBatch(batch).delete().then(function(){
                        results.push(true);
                    }, function(){
                        results.push(true);
                    });
                }
                        
                batch.execute().then(function(){
                        let resFinal = true;
                        for(let j=0; j<results.length; j++){
                            if(!results[j]){
                                resFinal = false;
                                break;
                            }
                        }
                        resolve(resFinal);
                }, function(){
                    reject(false);
                });
            } else {
                resolve(true);
            }
        }, function(){
            reject(false);
        });
    });
}

export async function searchPeople(v, g, type){
    return await sp.utility.searchPrincipals(v,
        (type?PrincipalType[type]:PrincipalType.All),
        PrincipalSource.All,
        (g?g:""),
        15
    );
}

export async function getMyProperties(){
    let props = await sp.profiles.myProperties.get();
    return props;
}

export async function getPropertiesFor(loginname){
    return await sp.profiles.getPropertiesFor(loginname);
}

export async function getWebInfo(){
    const site = await sp.site.get();
    return await sp.web.expand("AssociatedOwnerGroup").get();
}

export function getContext(){
    return currentContext;
}