package com.rsicms.teamEdition.dynamicLmd.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.reallysi.rsuite.api.ManagedObjectDefinition;
import com.reallysi.rsuite.api.NamespaceDecl;
import com.reallysi.rsuite.api.SchemaElementTypeInfo;
import com.reallysi.rsuite.api.SchemaInfo;
import com.reallysi.rsuite.api.remoteapi.RemoteApiResult;
import com.reallysi.rsuite.api.remoteapi.result.RestResult;
import com.reallysi.rsuite.service.SchemaService;
import com.rsicms.pluginUtilities.SimpleRemoteApiHandler;

public class ElementTypes extends SimpleRemoteApiHandler {

	@Override
	public RemoteApiResult execute() throws Throwable {
		SchemaService ss = context.getSchemaService();
		List<Map<String, String>> elementTypes = new ArrayList<Map<String, String>>();
		Map<String, Map<String, String>> elementTypeSet = new HashMap<String, Map<String, String>>();
		for (SchemaInfo si : ss.getSchemaInfoValues()) {
			Map<String, String> nsLookup = new HashMap<String, String>();
			if (null != si.getNamespaceDecls()) {
				for (@SuppressWarnings("deprecation") NamespaceDecl nsd : si.getNamespaceDecls()) {					
					nsLookup.put(nsd.getUri(), nsd.getPrefix());
				}
			}
			Map<String, ManagedObjectDefinition> moDefs = ss.getManagedObjectDefinitionCatalog(si.getSchemaId()).getManagedObjectDefinitions();
			for (String moDefKey : moDefs.keySet()) {
				ManagedObjectDefinition moDef = moDefs.get(moDefKey);
				Map<String, String> ret = new HashMap<String, String>();
				ret.put("localName", moDef.getName());
				ret.put("namespaceUri", moDef.getNamespaceUri());
				ret.put("prefix", nsLookup.get(moDef.getNamespaceUri()));
				String key = "";
				if (moDef.getNamespaceUri() != null) {
					key += "{" + moDef.getNamespaceUri() + "}:";
				}
				key += moDef.getName();
				elementTypeSet.put(key, ret);
			}
		}
		elementTypes.addAll(elementTypeSet.values());
		return new RestResult().setResponse(elementTypes);
	}

}
