<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:m="http://www.mendix.com/widget/1.0/">
<xsl:output method="text" indent="yes" />
<xsl:strip-space elements="*"/>
<!-- Properties -->
<xsl:template name="properties">
  <xsl:param name = "parent" />
    <xsl:value-of select="@key" />?: <xsl:choose>
    <xsl:when test="@type = 'entity' or @type = 'microflow' or @type = 'entityConstraint' or @type = 'attribute' or @type = 'form' or @type ='image' or @type = 'translatableString'">string</xsl:when>
    <xsl:when test="@type = 'integer'">number</xsl:when>
    <xsl:when test="@type = 'object'"><xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "@key" />
</xsl:call-template>[]</xsl:when>
    <xsl:when test="@type = 'enumeration'"><xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "$parent" />
</xsl:call-template><xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "@key" />
</xsl:call-template></xsl:when>
    <xsl:otherwise><xsl:value-of select="@type" /></xsl:otherwise>
    </xsl:choose><xsl:if test="position() != last()">;
    </xsl:if><xsl:if test="position() = last()">;</xsl:if>
</xsl:template>
<!-- Function template Capitalize first character-->
<xsl:template name="CapitalizeFirst">
  <xsl:param name = "name" />
        <xsl:value-of select="concat(translate(substring($name, 1, 1), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), substring($name, 2))" />
</xsl:template>
<!-- Main template -->
<xsl:template match="/" name="widget">
// WARNING do not make manual Changes to this file.
// widget.d.ts files is auto generated from the params in the widget.xml
// use > 'grunt xsltproc' or > 'grunt watch' to generate a new file

export default ModelProps;

export interface ModelProps {
    <xsl:for-each select="m:widget/m:properties/m:property">
<xsl:call-template name="properties" /></xsl:for-each>
}
<!-- Generate interface for object properties, only 1 level deep-->
<xsl:for-each select="m:widget/m:properties/m:property[@type='object']">
export interface <xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "@key" />
</xsl:call-template> {
    <xsl:for-each select="m:properties/m:property">
<xsl:call-template name="properties" ><xsl:with-param name="parent" select = "../../@key" /></xsl:call-template></xsl:for-each>
}
</xsl:for-each>
<!-- Generate string literal type for enum attributes -->
<xsl:for-each select="m:widget/m:properties/m:property[@type='enumeration']">
export type <xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "@key" />
</xsl:call-template> = <xsl:for-each select="m:enumerationValues/m:enumerationValue">"<xsl:value-of select="@key" />"<xsl:if test="position() != last()"> | </xsl:if></xsl:for-each>;
</xsl:for-each>
<!-- Generate string literal type for enums inside object attributes, only 1 level deep -->
<xsl:for-each select="m:widget/m:properties/m:property[@type='object']/m:properties/m:property[@type='enumeration']">
export type <xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "../../@key" />
</xsl:call-template><xsl:call-template name="CapitalizeFirst">
    <xsl:with-param name="name" select = "@key" />
</xsl:call-template> = <xsl:for-each select="m:enumerationValues/m:enumerationValue">"<xsl:value-of select="@key" />"<xsl:if test="position() != last()"> | </xsl:if></xsl:for-each>;
</xsl:for-each>

</xsl:template>
</xsl:stylesheet>