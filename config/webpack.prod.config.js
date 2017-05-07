var webpack=require("webpack");
var path=require("path");
var HtmlWebpackPlugin=require("html-webpack-plugin");
var webpackBasicConfig=require("./webpack.basic.config");
var merge=require("webpack-merge");
var ExtractTextPlugin=require("extract-text-webpack-plugin");

module.exports=merge.smart({},webpackBasicConfig,{
    entry:{
        index:path.resolve(__dirname,'..','src/client/index'),
        article:path.resolve(__dirname,'..','src/client/article'),
        vendor:['vue','axios']
    },
    output:{
        path:path.resolve(__dirname,'..','dist'),
        publicPath:'/',
        filename:'[name].[chunkhash:7].js',
        chunkFilename:'[name].[chunkhash:7].js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                loader:ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test:/\.vue$/,
                use:[{
                    loader:'vue-loader',
                    options:{
                        loaders:{
                            css:ExtractTextPlugin.extract({
                                fallback: 'style-loader',
                                use: 'css-loader'
                            })
                        }
                    }
                }],
            },
        ]
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor',
            filename:'[name].[chunkhash:7].js'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:false,
                drop_console:false
            },
            comments:false,
            minimize:false
        }),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:'"production"'
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname,'..','src/client/index/index.html'),
            inject: true,
            chunks:['vendor','index'],
            minify:{
                removeComments: true,        //去注释
                collapseWhitespace: true,    //压缩空格
                removeAttributeQuotes: true  //去除属性引用
            }
        }),
        new HtmlWebpackPlugin({
            filename:'article.html',
            template:path.resolve(__dirname,'..','src/client/article/article.html'),
            inject:true,
            chunks:['vendor','article'],
            minify:{
                removeComments: true,        //去注释
                collapseWhitespace: true,    //压缩空格
                removeAttributeQuotes: true  //去除属性引用
            }
        }),
        new ExtractTextPlugin('[name].[contenthash:7].css')
    ]
});