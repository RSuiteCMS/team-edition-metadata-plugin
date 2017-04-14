import com.reallysi.rsuite.admin.importer.*
import com.reallysi.rsuite.client.api.*

// -----------------------------------------------------------------------


def projectDir = new File(scriptFile.absolutePath).parentFile.parentFile
def doctypesDir = new File(projectDir, "src/main/resources/doctypes");
def File catalogFile = new File(doctypesDir, "catalog.xml");
def catalog = catalogFile.getAbsolutePath();
println "catalog=\"" + catalog + "\"";

def srcDir = new File(projectDir, "src/main/resources");
def xsltDir = new File(srcDir, "xslt");
def schemaType = "XMLSchema";
def schemaDir = doctypesDir;
def publicId = "";
def previewXsltFile = new File(xsltDir, "default.xsl");

def namespaceDecls = null;

println " + [INFO] Logging into RSuite...";

rsuite.login();


// --------- status workflow ----------

def schemaName = "lmd-configuration.xsd";
previewXsltFile = new File(xsltDir, "lmd-configuration.preview.xsl");

println " + [INFO] schema directory: " + schemaDir;
println " + [INFO] xslt: ${previewXsltFile}";

moDefList = [
  new ManagedObjectDefinition(
      ['name' : 'lmd-configuration',
      'displayNameXPath': '@name',
      'versionable': 'true',
      'reusable': 'true',
      'browsable': 'true'])
      ]
loadSchema(schemaType, schemaDir, schemaName, publicId, schemaName, previewXsltFile, namespaceDecls, moDefList);

// DONE 

rsuite.logout();


//-----------------------------------------------------------------------


def loadSchema(schemaType, schemaDir, schemaName, publicId, systemId, htmlPreviewXsltFile, namespaceDecls, moDefList) {
    println "";
    println " + [INFO] loadSchema(): Loading \"" + schemaName + "\"";
    def uuid 
    def schemaFile = new File(schemaDir, schemaName);
	println "schemaFile=${schemaFile}";
    if (schemaType == "DTD") {
      def schemaSrc = new SchemaInputSource(schemaFile, systemId, publicId);
      def importer = importerFactory.generateImporter(schemaType, schemaSrc);
	  //importer.setCatalogNames((String[])[catalog])
      uuid = importer.importDtd()
    } else if (schemaType == "XMLSchema"){
      def schemaSrc = new SchemaInputSource(schemaFile);
	  println "schemaSrc=${schemaSrc}";
      def importer = importerFactory.generateImporter(schemaType, schemaSrc);
	  println "importer=${importer}";
      uuid = importer.execute()
    } else {
		println "Unrecognized schema type \"${schemaType}\", expected 'DTD' or 'XMLSchema'";
		return;
	}

    if (moDefList != null) {
      println " + [INFO] loadSchema(): Setting managed object definitions...";
      println " + [DEBUG] loadSchema(): namespaceDecls=" + namespaceDecls;
      rsuite.setManagedObjectDefinitions(uuid, false, namespaceDecls, moDefList)
    }

    if (htmlPreviewXsltFile != null) {
      println " + [INFO] loadSchema(): Setting preview style sheet to \"" + htmlPreviewXsltFile.name + "\"...";
      rsuite.loadStylesheetForSchema(uuid, htmlPreviewXsltFile)
    }

    return uuid;
}
